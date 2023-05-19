import Constants from "../configs/Constants";
import IsEmpty from "./IsEmpty";
import Config from "../configs/Config";

const AdminRole = (admin, menu) => {
    const type = admin?.type;
    if (IsEmpty(type)) return false;
    switch (type) {
        case Constants.AdminType.ADMINISTRATOR:
            return true;
        case Constants.AdminType.MIDWAFE:
            switch (menu) {
                case Config.Routers.Home:
                    return true;
                case Config.Routers.MedicalRecords:
                    return true;
                case Config.Routers.Receipts:
                    return true;
                default:
                    return false;
            }
        case Constants.AdminType.PHARMACIST:
            switch (menu) {
                case Config.Routers.Home:
                    return true;
                case Config.Routers.Medicines:
                    return true;
                case Config.Routers.Receipts:
                    return true;
                default:
                    return false;
            }
        case Constants.AdminType.OFFICER:
            switch (menu) {
                case Config.Routers.Home:
                    return true;
                case Config.Routers.Users:
                    return true;
                case Config.Routers.Visits:
                    return true;
                case Config.Routers.MedicalRecords:
                    return true;
                default:
                    return false;
            }
        case Constants.AdminType.CASHIER:
            switch (menu) {
                case Config.Routers.Home:
                    return true;
                case Config.Routers.Receipts:
                    return true;
                default:
                    return false;
            }
        default:
            return false;
    }
};

export default AdminRole;
