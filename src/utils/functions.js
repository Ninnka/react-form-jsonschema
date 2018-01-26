export default {
  getPropertyJsType: (property) => {
    return Object.prototype.toString.call(property);
  }
}
