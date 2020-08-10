import os, json, math, xlsxwriter, StringIO
from datetime import datetime, timedelta
from collections import OrderedDict
from xlsxwriter.utility import xl_range

from os.path import join, dirname, exists
from dotenv import load_dotenv
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from pymongo import MongoClient

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

dates = ["2020-08-01", "2020-08-31"]
def monthlist_short(dates):
    start, end = [datetime.strptime(_, "%Y-%m-%d") for _ in dates]
    return OrderedDict(((start + (timedelta(_))).strftime(r"%d/%m/%Y"), None) for _ in xrange(((end+timedelta(days=1)) - start).days)).keys()

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

workbook = xlsxwriter.Workbook('hello_world.xlsx')
worksheet = workbook.add_worksheet()

bold = workbook.add_format({'bold': True})

worksheet.write('A1', 'Nama Divisi')
worksheet.write('B1', 'IT-Dev', bold)

listDate = monthlist_short(dates)

# Write some numbers, with row/column notation.
worksheet.write(2, 0, "NAMA PEGAWAI")

indexDate = 0
for i in listDate:
    indexDate += 1
    worksheet.write(2, indexDate, i)

worksheet.write(2, len(listDate)+1, "TOTAL")
worksheet.write(2, len(listDate)+2, "TTD")
divisi = 'fa67d855-3371-4f10-8996-bed93ba9355e'
result = db.session.execute("SELECT accounts_account.id, accounts_account.first_name, accounts_account.last_name FROM accounts_account WHERE accounts_account.id_divisi = :divisi", {'divisi': divisi})
indexNamePegawai = 2
for i in result:
    indexNamePegawai += 1
    fullname = i[1]+" "+i[2]
    worksheet.write(indexNamePegawai, 0, fullname)
    # worksheet.write(indexNamePegawai, len(listDate)+1, 100)
    indexDate = 0
    for date in listDate:
        indexDate += 1
        hour = getHours(i[0], date, date)
        worksheet.write(indexNamePegawai, indexDate, hour)
        cell_range = xl_range(indexNamePegawai, 1, indexNamePegawai, indexDate)
        formula = '=SUM(%s)' % cell_range
        worksheet.write_formula(indexNamePegawai, len(listDate)+1, formula)

workbook.close()


@app.route('/api/export-execel/')
def exportExcel():
    excelcontent = output.getvalue()
    response = Response(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        body=excelcontent)
    response.headers.add('Content-Disposition',
                         "attachment; filename=%s.xlsx" % nice_filename)
    response.headers.add('Access-Control-Expose-Headers','Content-Disposition')
    response.headers.add("Content-Length", str(len(excelcontent)))
    response.headers.add('Last-Modified', last_modified)
    response.headers.add("Cache-Control", "no-store")
    response.headers.add("Pragma", "no-cache")

    return response

if __name__ == '__main__':
      app.run(debug=True, host='0.0.0.0', port=8102)