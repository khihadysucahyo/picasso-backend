import os, json, math, xlsxwriter, io
from datetime import datetime, timedelta
from xlsxwriter.utility import xl_range

from os.path import join, dirname, exists
from dotenv import load_dotenv
from flask import Flask, send_file, request
from flask_sqlalchemy import SQLAlchemy
from pymongo import MongoClient
from utils import monthlist_short

app = Flask(__name__)

dotenv_path = ''
if exists(join(dirname(__file__), '../../.env')):
    dotenv_path = join(dirname(__file__), '../../.env')
else:
    dotenv_path = join(dirname(__file__), '../.env')

load_dotenv(dotenv_path)

mongoURI = 'mongodb://{dbhost}:{dbport}/'.format(
    dbhost=os.environ.get('DB_MONGO_HOST'),
    dbport=os.environ.get('DB_MONGO_PORT')
)
mongoClient = MongoClient(mongoURI)

postgreURI = 'postgresql+psycopg2://{dbuser}:{dbpass}@{dbhost}:{dbport}/{dbname}'.format(
    dbuser=os.environ.get('DB_USER_AUTH'),
    dbpass=os.environ.get('DB_PASSWORD_AUTH'),
    dbhost=os.environ.get('POSTGRESQL_HOST'),
    dbport=os.environ.get('POSTGRESQL_PORT'),
    dbname=os.environ.get('DB_NAME_AUTH')
)

app.config.update(
    SQLALCHEMY_DATABASE_URI=postgreURI,
    SQLALCHEMY_TRACK_MODIFICATIONS=False
)

db = SQLAlchemy(app)

def getHours(idUser, start_date, end_date):
    dbMongo = mongoClient.attendance
    agr = [
        {
            '$match': {
                "createdBy._id": str(idUser),
                'startDate': {
                    '$gte': datetime.strptime(start_date+'-0:0:0', '%d/%m/%Y-%H:%M:%S'),
                    '$lt': datetime.strptime(end_date+'-23:59:59', '%d/%m/%Y-%H:%M:%S')
                }
            }
        }, {
            '$project': {
                '_id': 0,
                'officeHours': 1
            }
        }
    ]

    itm = list(dbMongo.attendances.aggregate(agr))
    if not itm:
        count = 0
    else:
      count = math.ceil(itm[0]['officeHours'])
    return count

@app.route('/api/export-excel/')
def exportExcel():
    divisi = request.args.get('divisi')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    dates = [start_date, end_date]

    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    worksheet = workbook.add_worksheet()

    bold = workbook.add_format({'bold': True})

    worksheet.write('A1', 'Nama Divisi')

    listDate = monthlist_short(dates)

    # Write some numbers, with row/column notation.
    worksheet.write(2, 0, "NAMA PEGAWAI")

    indexDate = 0
    for i in listDate:
        indexDate += 1
        worksheet.write(2, indexDate, i)

    worksheet.write(2, len(listDate)+1, "TOTAL")
    worksheet.write(2, len(listDate)+2, "TTD")
    result = db.session.execute("SELECT accounts_account.id, accounts_account.first_name, accounts_account.last_name, accounts_account.divisi FROM accounts_account WHERE accounts_account.id_divisi = :divisi", {'divisi': divisi})
    divisiName = ''
    indexNamePegawai = 2
    for i in result:
        indexNamePegawai += 1
        fullname = i[1]+" "+i[2]
        divisiName = i[3]
        worksheet.write(indexNamePegawai, 0, fullname)
        indexDate = 0
        for date in listDate:
            indexDate += 1
            hour = getHours(i[0], date, date)
            worksheet.write(indexNamePegawai, indexDate, hour)
            cell_range = xl_range(indexNamePegawai, 1, indexNamePegawai, indexDate)
            formula = '=SUM(%s)' % cell_range
            worksheet.write_formula(indexNamePegawai, len(listDate)+1, formula)

    worksheet.write('B1', divisiName, bold)

    nameFile = divisiName.split(" ")
    nameFile = "".join(divisiName)
    workbook.close()
    output.seek(0)
    return send_file(output, attachment_filename="%s.xlsx" % nameFile, as_attachment=True)

port = os.environ.get('EXPORT_EXCEL_PORT', 80)
if __name__ == '__main__':
      app.run(debug=True, host='0.0.0.0', port=int(port))