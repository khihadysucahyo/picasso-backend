const fs = require('fs')
const PdfPrinter = require('pdfmake')
const moment = require('moment')
moment.locale('id')

const generateReport = (docDefinition, filePath) => {
  return new Promise((resolve, reject) => {
      try {
          const fonts = {
            Roboto: {
              normal: 'static/fonts/Roboto-Regular.ttf',
              bold: 'static/fonts/Roboto-Medium.ttf',
              italics: 'static/fonts/Roboto-Italic.ttf',
              bolditalics: 'static/fonts/Roboto-MediumItalic.ttf'
            }
          }
          const printer = new PdfPrinter(fonts)
          const pdfDoc = printer.createPdfKitDocument(docDefinition)
          const stream = pdfDoc.pipe(fs.createWriteStream(filePath))
          stream.on('finish', function(){
              const pdfFile = fs.readFileSync(filePath)
              fs.unlinkSync(filePath)
              resolve(pdfFile)
          })
          pdfDoc.end();
      } catch (err) {
          reject(err)
      }
  })
}

const logBook = (data) => {
    let records = []
    data.forEach((item, index) => {
        records.push([ 
            { text: index + 1 },
            { text: moment(item.dateTask).format('dddd, DD MMMM YYYY') },
            { text: item.projectName + ' - ' +  item.nameTask},
            { text: '-' },
            { text: 'PLD' },
            { text: item.isMainTask ? '√' : '' },
            { text: !item.isMainTask ? '√' : '' }
        ])
    })
    return records
}

const reportForm = (data) => {
  const { user } = data
  const docDefinition = {
      content: [
          {
              image: 'static/images/logo_jabarprov.png',
              alignment: 'center',
              margin: [0, 15, 0, 0],
              width: 150
          },
          {
            text: 'LAPORAN',
            alignment: 'center',
            margin: [0, 85, 0, 0],
            bold: true,
            fontSize: 16
          },
          {
            text: 'BULAN JULI 2020',
            alignment: 'center',
            bold: true,
            fontSize: 11
          },
          {
            text: 'IMPLEMENTASI DAN PEMELIHARAAN INFRASTRUKTUR COMMAND CENTER',
            alignment: 'center',
            margin: [0, 85, 0, 0],
            bold: true,
            fontSize: 11
          },
          {
            text: `${user.username}`,
            margin: [0, 85, 0, 0],
            alignment: 'center',
            bold: true,
            fontSize: 11
          },
          {
            text: `${user.divisi}`,
            alignment: 'center',
            bold: true,
            fontSize: 11
          },
          {
            text: 'TENAGA AHLI PENGELOLA LAYANAN DIGITAL',
            alignment: 'center',
            margin: [0, 105, 0, 0],
            bold: true,
            fontSize: 11
          },
          {
            text: 'DINAS KOMUNIKASI INFORMATIKA',
            alignment: 'center',
            bold: true,
            fontSize: 11
          },
          {
            text: 'PROVINSI JAWA BARAT',
            alignment: 'center',
            bold: true,
            fontSize: 11
          },
          {
            text: '2020',
            alignment: 'center',
            bold: true,
            fontSize: 11
          },
          // BODY   
          {
              alignment: 'center',
              bold: true,
              fontSize: 11,
              pageBreak: 'before',
              pageOrientation: 'landscape',
              color: 'black',
              fillColor: '#1aa3ff',
              table: {
                headerRows: 1,
                widths: [ '*' ],
                body: [
                  [ { text: 'LAPORAN HARIAN', border: [] } ],
                  [ { text: 'JABAR DIGITAL SERVICE', border: [] } ]
                ]
              }
          },
          {
            margin: [0, 25, 0, 0],
            bold: true,
            fontSize: 11,
            table: {
                headerRows: 1,
                widths: [ 70, 120, '*' ],
                body: [
                    [ 
                        { text: 'Bulan: Juli', border: [] },
                        { text: 'Tahun: 2020', border: [] },
                        { 
                            text: 'Instansi: Dinas Komunikasi dan Informatika Jawa Barat',
                            alignment: 'right',
                            border: []
                        },

                    ],
                ]
            }
         },
         {
            margin: [0, 5, 0, 0],
            bold: true,
            fontSize: 11,
            table: {
                headerRows: 1,
                widths: [ 120, 10, 10, '*' ],
                body: [
                    [ 
                        { text: 'Nama' },
                        { text: '' },
                        { text: ':' },
                        { text: 'Khi Hady Sucahyo' }
                    ],
                    [ 
                        { text: 'Divisi' },
                        { text: '' },
                        { text: ':' },
                        { text: `${user.divisi}` }
                    ],
                    [ 
                        { text: 'Jabatan' },
                        { text: '' },
                        { text: ':' },
                        { text: `${user.jabatan}` }
                    ],
                    [ 
                        { text: 'URAIAN TUGAS\n(DESKRIPSI JABATAN)' },
                        { text: '' },
                        { text: ':' },
                        {
                            ol: [
                                'item 1',
                                'Lorem ipsum dolor sit amet, consectetur ..',
                                'item 3',
                            ]
                        }
                    ],
                ]
            }
         },
         {
            margin: [0, 10, 0, 0],
            text: 'RINCIAN HASIL KERJA SELAMA BULAN JULI',
            bold: true,
            fontSize: 11
         },
         // DATA LAPORAN 
         {
            alignment: 'center',
            margin: [0, 5, 0, 0],
            bold: true,
            fontSize: 11,
            table: {
                headerRows: 2,
                widths: [ 20, 80, '*', 100, 100, 100, 100 ],
                body: [
                    [ 
                        { text: 'No', style: 'tableHeader', rowSpan: 2 },
                        { text: 'HARI/TANGGAL', style: 'tableHeader', rowSpan: 2 },
                        { text: 'KEGIATAN', style: 'tableHeader', rowSpan: 2 },
                        { text: 'TEMPAT', style: 'tableHeader', rowSpan: 2 },
                        { text: 'PENYELENGGARA', style: 'tableHeader', rowSpan: 2 },
                        { text: 'KETERANGAN', style: 'tableHeader', colSpan: 2 },
                        {},
                    ],
                    [
                        "", "", "", "", "",
                        { text: 'Tugas Pokok', style: 'tableHeader' },
                        { text: 'Tugas Tambahan', style: 'tableHeader', },
                    ],
                    ...logBook(data.logBook)
                ]
            }
         },
        // EVIDENCE   
        {
            alignment: 'center',
            bold: true,
            fontSize: 11,
            pageBreak: 'before',
            pageOrientation: 'landscape',
            text: 'LAMPIRAN'
        },
        {
            fontSize: 11,
            text: 'Berikut adalah evidence daftar uraian kegiatan harian yang didetailkan setiap harinya dibulan MARET 2020 ini.'
        },
        // TODO LOOPING
        {
            margin: [0, 15, 0, 0],
            fontSize: 11,
            text: 'Hari, Tanggal : Rabu, 26 Februari 2020'
        },
        {
            margin: [10, 0, 0, 0],
            fontSize: 11,
            text: '1. [PROJECT/PRODUCT] - NAMA TASK'
        },
        {
            margin: [20, 0, 0, 0],
            fontSize: 11,
            text: 'a. FOTO'
        },
        {
            margin: [20, 0, 0, 0],
            width: 100,
            image: 'static/images/logo_jabarprov.png',
            width: 150

        },
        {
            margin: [20, 0, 0, 0],
            fontSize: 11,
            text: 'b. LINK'
        }
      ],
      styles: {
          header: {
              bold: true,
              fontSize: 15
          },
          tableHeader: {
            bold: true,
            fontSize: 12,
            color: 'black',
            fillColor: '#1aa3ff'
          },
      },
      defaultStyle: {
          fontSize: 12,
      }
  }

    return docDefinition
}

module.exports = {
  reportForm,
  generateReport
}
