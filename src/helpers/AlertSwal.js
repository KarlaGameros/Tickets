import Swal from "sweetalert2";

const AlertSwal = async (icon, resp) => {
  Swal.fire({
    position: "top-end",
    title: resp.data,
    icon: icon,
    showConfirmButton: false,
    timer: 1500,
  });
};

export default AlertSwal;
