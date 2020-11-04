
function request({ method = 'GET', url, body, success, fail}) {
    method = method || 'GET';
    var httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
    httpRequest.open(method, url, true);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
    var data = null;
    if(method == 'POST') {
        httpRequest.setRequestHeader("Content-Type", "application/json");
        data = JSON.stringify(body)
    }
    httpRequest.send(data);//第三步：发送请求  将请求参数写在URL中
    /**
     * 获取数据后的处理程序
     */
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4) {
            if(httpRequest.status >= 200 && httpRequest.status <= 300) {
                var json = httpRequest.responseText;//获取到json字符串，还需解析
                var data = JSON.parse(json)
                success(data);
            } else {
                var json = httpRequest.responseText;//获取到json字符串，还需解析
                var data = JSON.parse(json)
                fail(data);
            }
            
        }
    };

}