import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportToPDF = async (resumeElement, filename) => {
          try {
                    const canvas = await html2canvas(resumeElement, {
                              scale: 2,
                              useCORS: true,
                              logging: false
                    });

                    const imgData = canvas.toDataURL('image/jpeg', 1.0);
                    const pdf = new jsPDF({
                              orientation: 'portrait',
                              unit: 'px',
                              format: 'a4'
                    });

                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    const imgWidth = canvas.width;
                    const imgHeight = canvas.height;
                    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                    const imgX = (pdfWidth - imgWidth * ratio) / 2;
                    const imgY = 30;

                    pdf.addImage(
                              imgData,
                              'JPEG',
                              imgX,
                              imgY,
                              imgWidth * ratio,
                              imgHeight * ratio
                    );

                    pdf.save(filename);
                    return true;
          } catch (error) {
                    console.error('Error exporting PDF:', error);
                    return false;
          }
};