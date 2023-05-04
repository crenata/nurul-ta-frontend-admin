const IsEmpty = (data) => {
    if (typeof data === "object") {
        return !data;
    } else if (Array.isArray(data)) {
        return data.length === 0;
    } else if (typeof data === "string") {
        if (!data.trim()) {
            return true;
        } else if (data === "undefined") {
            return true;
        } else if (data === "null") {
            return true;
        }
        return false;
    } else if (typeof data === "number") {
        return data === 0;
    } else if (typeof data === "undefined") {
        return true;
    }
    return false;
};

export default IsEmpty;