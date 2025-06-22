import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export const exportTasksToExcel = async (req, res) => {
  try {
    const tasks = await req.db.collection('tasks').find({}).toArray();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Tasks');

    sheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Max End Date', key: 'maxEndDate', width: 20 },
      { header: 'Completed', key: 'completed', width: 10 }
    ];

    tasks.forEach(task => {
      sheet.addRow({
        title: task.title,
        type: task.type,
        maxEndDate: new Date(task.maxEndDate).toLocaleDateString(),
        completed: task.completed ? 'Yes' : 'No'
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).json({ error: 'Failed to export tasks to Excel', details: err.message });
  }
};

export const exportTasksToPDF = async (req, res) => {
  try {
    const tasks = await req.db.collection('tasks').find({}).toArray();

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Tasks Report', { align: 'center' });
    doc.moveDown();

    tasks.forEach(task => {
      doc.fontSize(12).text(`Title: ${task.title}`);
      doc.text(`Type: ${task.type}`);
      doc.text(`Max End Date: ${new Date(task.maxEndDate).toLocaleDateString()}`);
      doc.text(`Completed: ${task.completed ? 'Yes' : 'No'}`);
      doc.moveDown();
    });

    doc.end();

  } catch (err) {
    res.status(500).json({ error: 'Failed to export tasks to PDF', details: err.message });
  }
};
