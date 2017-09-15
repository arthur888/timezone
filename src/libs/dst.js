function getDST(date){
    var dst_dates = {
        is_dst: false,
        start: null,
        end: null
    }
    var currentDate = date;
    var currentYear = currentDate.getFullYear();

    // DST Start
    var firstOfMarch = new Date(currentYear, 2, 1);
    var daysUntilFirstSundayInMarch = (7 - firstOfMarch.getDay()) % 7;
    var secondSundayInMarch = firstOfMarch.getDate() + daysUntilFirstSundayInMarch + 7;
    var dstStartDate = new Date(currentYear, 2, secondSundayInMarch);

    // DST End
    var firstOfNovember = new Date(currentYear, 10, 1);
    var daysUntilFirstSundayInNov = (7 - firstOfNovember.getDay()) % 7;
    var firstSundayInNovember = firstOfNovember.getDate() + daysUntilFirstSundayInNov;
    var dstEndDate = new Date(currentYear, 10, firstSundayInNovember);

    dst_dates.start = dstStartDate;
    dst_dates.end = dstEndDate;
    dst_dates.is_dst = true;
    return dst_dates;    
}

export default getDST;