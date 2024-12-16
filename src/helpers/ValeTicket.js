import { jsPDF } from "jspdf";
import { storeToRefs } from "pinia";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";

const ValeTicket = async () => {
  try {
    const misSolicitudesStore = useMisSolicitudesStore();
    const { solicitud } = storeToRefs(misSolicitudesStore);

    //--------------------------------------------------------------------------
    //IMAGE IEEN
    let img = new Image();
    img.src = require("../assets/IEEN300.png");
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });
    doc.setFontSize(9);
    let pdfWidth = doc.internal.pageSize.getWidth();
    let pdfHeight = doc.internal.pageSize.getHeight();

    //--------------------------------------------------------------------------
    //HEADER
    function createHeader() {
      doc.addImage(img, "png", 10, 2, 35, 21);
      doc.addImage(img, "png", 10, 142, 35, 20);
      doc.setFont("helvetica", "bold");
      doc.text(
        "INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n \n TICKET",
        110,
        12,
        null,
        null,
        "center"
      );
      doc.text(
        "INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n \n TICKET",
        110,
        150,
        null,
        null,
        "center"
      );
      //--------------------------------------------------------------------------//
      //COPIA
      doc.setFillColor(84, 37, 131);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.1);

      doc.rect(10, 28, 40, 5, "FD");
      doc.rect(10, 33, 40, 5, "FD");
      doc.rect(10, 38, 40, 5, "FD");

      doc.setTextColor(255, 255, 255);
      doc.text("No. Ticket", 12, 32);
      doc.text("Fecha inicio", 12, 37);
      doc.text("Fecha fin", 12, 42);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      doc.rect(50, 28, 50, 5);
      doc.text(solicitud.value.folio, 60, 32);

      doc.rect(50, 33, 50, 5);
      doc.text(solicitud.value.fecha_Inicio, 60, 37);

      doc.rect(50, 38, 50, 5);
      doc.text(solicitud.value.fecha_Fin, 60, 42);

      doc.setFillColor(84, 37, 131);
      doc.rect(10, 48, 195, 5, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("DATOS DEL SOLICITANTE", 85, 51);
      doc.setTextColor(0, 0, 0);
      doc.rect(10, 52, 195, 5, "FD");
      doc.text("Responsable: ", 15, 56);
      doc.rect(10, 57, 195, 5);
      doc.rect(10, 62, 195, 5);
      doc.text("Cargo:", 15, 61);
      doc.text("Área:", 15, 66);

      doc.setFont("helvetica", "normal");
      doc.text(solicitud.value.solicitante, 40, 56);
      doc.text(solicitud.value.solicitante_Area, 28, 66);
      doc.text(solicitud.value.solicitante_Puesto, 30, 61);

      doc.setFillColor(84, 37, 131);
      doc.rect(10, 67, 195, 5, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("MOTIVO", 102, 70);
      doc.setTextColor(0, 0, 0);
      doc.rect(10, 71, 195, 15, "FD");
      //MOTIVO
      doc.setFont("helvetica", "normal");
      var strMotivo = doc.splitTextToSize(
        solicitud.value.descripcion,
        pdfWidth - 26
      );
      doc.text(strMotivo, 11, 75);
      //CONCLUSION
      doc.setFillColor(84, 37, 131);
      doc.rect(10, 85, 195, 5, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("CONCLUSIÓN", 98, 88);
      doc.setTextColor(0, 0, 0);
      doc.rect(10, 89, 195, 15, "FD");
      doc.setFont("helvetica", "normal");
      var strConclusion = doc.splitTextToSize(
        solicitud.value.observaciones,
        pdfWidth - 26
      );
      doc.text(strConclusion, 11, 94);

      //--------------------------------------------------------------------------//
      //SOLICITANTE
      doc.setFont("helvetica", "bold");
      doc.setFillColor(84, 37, 131);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.1);

      doc.rect(10, 165, 40, 5, "FD");
      doc.rect(10, 170, 40, 5, "FD");
      doc.rect(10, 175, 40, 5, "FD");

      doc.setTextColor(255, 255, 255);
      doc.text("No. Ticket", 12, 169);
      doc.text("Fecha creación", 12, 173);
      doc.text("Fecha fin", 12, 178);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      doc.rect(50, 165, 50, 5);
      doc.text(solicitud.value.folio, 60, 169);

      doc.rect(50, 170, 50, 5);
      doc.text(solicitud.value.fecha_Creacion, 60, 174);

      doc.rect(50, 175, 50, 5);
      doc.text(solicitud.value.fecha_Fin, 60, 179);

      doc.setFillColor(84, 37, 131);
      doc.rect(10, 185, 195, 4, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("DATOS DEL SOLICITANTE", 85, 188);
      doc.setTextColor(0, 0, 0);
      doc.rect(10, 189, 195, 5, "FD");
      doc.text("Responsable: ", 15, 193);
      doc.rect(10, 194, 195, 5);
      doc.rect(10, 199, 195, 5);
      doc.text("Cargo:", 15, 198);
      doc.text("Área:", 15, 203);

      doc.setFont("helvetica", "normal");
      doc.text(solicitud.value.solicitante, 40, 193);
      doc.text(solicitud.value.solicitante_Area, 28, 203);
      doc.text(solicitud.value.solicitante_Puesto, 30, 198);

      doc.setFillColor(84, 37, 131);
      doc.rect(10, 204, 195, 5, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("MOTIVO", 102, 207);
      doc.setTextColor(0, 0, 0);
      doc.rect(10, 208, 195, 15, "FD");
      //MOTIVO
      doc.setFont("helvetica", "normal");
      var strMotivo = doc.splitTextToSize(
        solicitud.value.descripcion,
        pdfWidth - 26
      );
      doc.text(strMotivo, 11, 212);
      //CONCLUSION
      doc.setFillColor(84, 37, 131);
      doc.rect(10, 223, 195, 5, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("CONCLUSIÓN", 98, 226);
      doc.setTextColor(0, 0, 0);
      doc.rect(10, 227, 195, 15, "FD");
      doc.setFont("helvetica", "normal");
      var strConclusion = doc.splitTextToSize(
        solicitud.value.observaciones,
        pdfWidth - 26
      );
      doc.text(strConclusion, 11, 232);
    }

    //--------------------------------------------------------------------------------------------------------------------------
    doc.setFont("helvetica", "bold");
    doc.setLineWidth(0.1);
    doc.line(25, 121, 85, 121);
    doc.text(solicitud.value.solicitante, 55, 125, null, null, "center");
    doc.text(
      "NOMBRE Y FIRMA \n" + "SOLICITANTE",
      55,
      129,
      null,
      null,
      "center"
    );

    doc.setLineWidth(0.1);
    doc.line(25, 257, 85, 257);
    doc.text(solicitud.value.solicitante, 55, 261, null, null, "center");
    doc.text(
      "NOMBRE Y FIRMA \n" + "SOLICITANTE",
      55,
      265,
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
      124,
      null,
      null,
      "center"
    );
    doc.text(
      "NOMBRE Y FIRMA \n" + "RESPONSABLE",
      150,
      128,
      null,
      null,
      "center"
    );

    doc.setLineWidth(0.1);
    doc.line(120, 257, 180, 257);

    doc.text(
      solicitud.value.responsable_Ticket,
      150,
      261,
      null,
      null,
      "center"
    );
    doc.text(
      "NOMBRE Y FIRMA \n" + "RESPONSABLE",
      150,
      265,
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
      data: "Recibo generado con éxito",
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
