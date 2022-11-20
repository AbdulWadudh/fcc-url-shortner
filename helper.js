const isUrlValid = (urlString) => {
    var regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
    var urlValidator = new RegExp(regexQuery, "i");
    return urlValidator.test(urlString);
};

module.exports = {
    isUrlValid,
};
