/**
 * 获取不规则矩形的中点位置
 * @param points
 * @returns {number[]}
 */
var getPointsCenter = (points)=>{
    var point_num = points.length; //坐标点个数
    var X = 0, Y = 0, Z = 0;
    for(let i = 0; i< points.length; i++) {
        if (points[i] == '') {
            continue;
        }
        let point = points[i].split(',');
        var lat, lng, x, y, z;
        lat = parseFloat(point[0]) * Math.PI / 180;
        lng = parseFloat(point[1]) * Math.PI / 180;
        x = Math.cos(lat) * Math.cos(lng);
        y = Math.cos(lat) * Math.sin(lng);
        z = Math.sin(lat);
        X += x;
        Y += y;
        Z += z;
    }
    X = X / point_num;
    Y = Y / point_num;
    Z = Z / point_num;

    var tmp_lng = Math.atan2(Y, X);
    var tmp_lat = Math.atan2(Z, Math.sqrt(X * X + Y * Y));

    return [tmp_lat * 180 / Math.PI, tmp_lng * 180 / Math.PI];
}