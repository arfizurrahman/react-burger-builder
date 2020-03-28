export const updateObject = (oldObject, updatedPropeties) => {
    return {
        ...oldObject,
        ...updatedPropeties
    };
};

export const checkValidity = (value, rules) => {
    let isValid = true;

    if (!rules) {
        return true;
    }

    if (rules.required) {
        isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
        isValid = ValidateEmail(value) && isValid;
    }

    return isValid;
}

const ValidateEmail = (mail) => {
    const isValid = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{1,3})+$/.test(mail);
    return isValid;
}
