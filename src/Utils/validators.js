export const NSDLValidator = (DP_ID, CL_ID) => {
    ////console.log(DP_ID);
    if (DP_ID.length != 8 && CL_ID.length != 8) {
        return false
    }
    let value = DP_ID + CL_ID;

    let length = value.length;
    if (length != 16) {
        return false;
    }
    let regex = /IN[0-9]+/i;
    return regex.test(value);
}

export const CDSLValidator = (DP_ID) => {
    ////console.log(DP_ID);
    let length = DP_ID.length;
    if (length != 16) {
        return false;
    }
    let regex = /[0-9]+/i;
    return regex.test(DP_ID);
}

// export default {NSDLValidator,CDSLValidator};