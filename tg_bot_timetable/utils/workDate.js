export default new class workDate {
    
    checkFreeDay (date) {
        const [dd, mm, yyyy] = date.split('.');
        const day = new Date(yyyy, mm - 1, dd).getDay();
    
        return day == 0 || day == 6;
    }

    formattedDate (date) { return`${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear().toString().padStart(4, '0')}`}
    
    getModayAndFriday(date = new Date()) {

        const dayOfWeek = date.getDay();
        const mondayDiff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        
        const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - mondayDiff);
        const friday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 4);
        
        const formatteMonday = this.formattedDate(monday);
        const formatteFriday = this.formattedDate(friday);
        
        return [formatteMonday, formatteFriday];
    }
}