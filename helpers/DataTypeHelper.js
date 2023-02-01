class DataTypeHelper {
    static arrayToJSONObject(rows) {
        var array = rows.slice(1, rows.length);
        var keyArr = rows.shift();
        var data = [];
        array.forEach((element) => {
            var valueObject = {}
            element.forEach((elementObject, index) => {
                valueObject[keyArr[index]] = elementObject;
            });
            data.push(valueObject);
        });

        return data;
    };

    static uniqueObject(object, keyObject) {
        const key = keyObject;
        const unique = [...new Map(object.map(item =>
            [item[key], item])).values()];
    
        return unique;
    };
};

module.exports = DataTypeHelper