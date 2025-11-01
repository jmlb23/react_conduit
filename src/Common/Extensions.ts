declare global {
  export interface String {
    parseDate(): Date;
  }

  export interface Date {
    formatDate(format: { day: string, month: string, year: string }): string
  }
}
String.prototype.parseDate = function (this: string) {
  return new Date(this);
};

Date.prototype.formatDate = function (this: Date, format: { day: string, month: string, year: string }) {
  const allowedYear = ['numeric', '2-digit'];
  const allowedDay = ['numeric', '2-digit'];
  const allowedMonth = ['numeric', '2-digit', 'narrow', 'short', 'long'];

  const opts: Intl.DateTimeFormatOptions = {
    year: allowedYear.includes(format.year) ? (format.year as 'numeric' | '2-digit') : 'numeric',
    month: allowedMonth.includes(format.month) ? (format.month as Intl.DateTimeFormatOptions['month']) : 'numeric',
    day: allowedDay.includes(format.day) ? (format.day as 'numeric' | '2-digit') : 'numeric',
  };

  return this.toLocaleString('en', opts);
};

export {

}