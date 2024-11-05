import { jsPDF } from "jspdf";
import { storeToRefs } from "pinia";
import { useSolicitudesTicketStore } from "src/stores/mis-solicitudes-ticket";

const ValeTicket = async () => {
  try {
    const solicitudesTicketsStore = useSolicitudesTicketStore();
    const { solicitud } = storeToRefs(solicitudesTicketsStore);

    //--------------------------------------------------------------------------
    //IMAGE IEEN
    let img = new Image();
    img.src = require("../assets/IEEN300.png");
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });
    doc.setFontSize(9);
    let pdfWidth = doc.internal.pageSize.getWidth();
    //--------------------------------------------------------------------------
    //HEADER
    function createHeader() {
      doc.addImage(img, "png", 10, 5, 35, 21);
      doc.addImage(img, "png", 10, 142, 35, 20);
      doc.setFont("helvetica", "bold");
      doc.text(
        "INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n \n TICKET",
        110,
        15,
        null,
        null,
        "center"
      );
      //--------------------------------------------------------------------------//
      //COPIA
      doc.setFillColor(84, 37, 131);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.1);

      doc.rect(10, 30, 40, 5, "FD");
      doc.rect(10, 35, 40, 5, "FD");
      doc.rect(10, 40, 40, 5, "FD");

      doc.setTextColor(255, 255, 255);
      doc.text("No. Ticket", 12, 34);
      doc.text("Fecha inicio", 12, 39);
      doc.text("Fecha fin", 12, 44);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      doc.rect(50, 30, 50, 5);
      doc.text(solicitud.value.folio, 60, 34);

      doc.rect(50, 35, 50, 5);
      doc.text(solicitud.value.fecha_Inicio, 60, 39);

      doc.rect(50, 40, 50, 5);
      doc.text(solicitud.value.fecha_Fin, 60, 44);

      doc.setFillColor(84, 37, 131);
      doc.rect(10, 50, 195, 5, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("DATOS DEL SOLICITANTE", 85, 53);
      doc.setTextColor(0, 0, 0);
      doc.rect(10, 54, 195, 5, "FD");
      doc.text("Responsable: ", 15, 58);
      doc.rect(10, 59, 195, 5);
      doc.rect(10, 64, 195, 5);
      doc.text("Cargo:", 15, 63);
      doc.text("Área:", 15, 68);

      doc.setFont("helvetica", "normal");
      doc.text(solicitud.value.solicitante, 40, 58);
      doc.text(solicitud.value.solicitante_Area, 28, 68);
      doc.text(solicitud.value.solicitante_Puesto, 30, 63);

      doc.setFillColor(84, 37, 131);
      doc.rect(10, 69, 195, 5, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("MOTIVO", 102, 72);
      doc.setTextColor(0, 0, 0);
      doc.rect(10, 73, 195, 25, "FD");
      //MOTIVO
      doc.setFont("helvetica", "normal");
      var strMotivo = doc.splitTextToSize(
        solicitud.value.descripcion,
        pdfWidth - 26
      );
      doc.text(strMotivo, 11, 77);

      //--------------------------------------------------------------------------//
      //SOLICITANTE
      doc.setFont("helvetica", "bold");
      doc.setFillColor(84, 37, 131);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.1);

      doc.rect(10, 167, 40, 5, "FD");
      doc.rect(10, 172, 40, 5, "FD");
      doc.rect(10, 177, 40, 5, "FD");

      doc.setTextColor(255, 255, 255);
      doc.text("No. Ticket", 12, 171);
      doc.text("Fecha creación", 12, 175);
      doc.text("Fecha fin", 12, 180);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      doc.rect(50, 167, 50, 5);
      doc.text(solicitud.value.folio, 60, 171);

      doc.rect(50, 172, 50, 5);
      doc.text(solicitud.value.fecha_Creacion, 60, 176);

      doc.rect(50, 177, 50, 5);
      doc.text(solicitud.value.fecha_Fin, 60, 181);

      doc.setFillColor(84, 37, 131);
      doc.rect(10, 187, 195, 4, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("DATOS DEL SOLICITANTE", 85, 190);
      doc.setTextColor(0, 0, 0);
      doc.rect(10, 191, 195, 5, "FD");
      doc.text("Responsable: ", 15, 195);
      doc.rect(10, 196, 195, 5);
      doc.rect(10, 201, 195, 5);
      doc.text("Cargo:", 15, 200);
      doc.text("Área:", 15, 205);

      doc.setFont("helvetica", "normal");
      doc.text(solicitud.value.solicitante, 40, 195);
      doc.text(solicitud.value.solicitante_Area, 28, 205);
      doc.text(solicitud.value.solicitante_Puesto, 30, 200);

      doc.setFillColor(84, 37, 131);
      doc.rect(10, 206, 195, 5, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("MOTIVO", 102, 209);
      doc.setTextColor(0, 0, 0);
      doc.rect(10, 210, 195, 25, "FD");
      //MOTIVO
      doc.setFont("helvetica", "normal");
      var strMotivo = doc.splitTextToSize(
        solicitud.value.descripcion,
        pdfWidth - 26
      );
      doc.text(strMotivo, 11, 214);
    }

    //--------------------------------------------------------------------------------------------------------------------------
    doc.setFont("helvetica", "bold");
    doc.setLineWidth(0.1);
    doc.line(25, 121, 85, 121);
    doc.text(solicitud.value.solicitante, 55, 125, null, null, "center");
    doc.text(
      "NOMBRE Y FIRMA \n" + "SOLICITANTE",
      55,
      130,
      null,
      null,
      "center"
    );

    doc.setLineWidth(0.1);
    doc.line(25, 255, 85, 255);
    doc.text(solicitud.value.solicitante, 55, 259, null, null, "center");
    doc.text(
      "NOMBRE Y FIRMA \n" + "SOLICITANTE",
      55,
      264,
      null,
      null,
      "center"
    );

    //-------------------------------------------------------------------------------------------------------------------------------
    doc.setLineWidth(0.1);
    doc.line(120, 121, 180, 121);
    doc.text(
      solicitud.value.responsable_Ticket,
      150,
      125,
      null,
      null,
      "center"
    );
    doc.text(
      "NOMBRE Y FIRMA \n" + "RESPONSABLE",
      150,
      130,
      null,
      null,
      "center"
    );

    doc.setLineWidth(0.1);
    doc.line(120, 255, 180, 255);

    doc.text(
      solicitud.value.responsable_Ticket,
      150,
      259,
      null,
      null,
      "center"
    );
    doc.text(
      "NOMBRE Y FIRMA \n" + "RESPONSABLE",
      150,
      264,
      null,
      null,
      "center"
    );

    //--------------------------------------------------------------------------
    //CREATE FOOTER
    var newPageCount = doc.internal.getNumberOfPages();
    function createFooter() {
      doc.setPage(i + 1);
      doc.setTextColor(0, 0, 0);
      doc.text(
        "Página " + (i + 1) + " de " + newPageCount,
        200,
        270,
        null,
        null,
        "right"
      );
    }

    for (var i = 0; i < newPageCount; i++) {
      createHeader();
      createFooter();
    }

    doc.setLineDash([2.5]);
    doc.line(1, 140, 215, 140);
    doc.setTextColor(150);
    doc.text("Copia para la Unidad Tecnica de Informatica", 8, 113, null, 90);
    doc.text("Copia del solicitante", 8, 240, null, 90);

    doc.save(`Ticket_${solicitud.value.folio}` + ".pdf");
    return {
      success: true,
      msj: "Recibo generado con éxito",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};
export default ValeTicket;
