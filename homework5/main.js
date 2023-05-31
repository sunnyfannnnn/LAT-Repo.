$(document).ready(function(){
    //do something
    $("#thisButton").click(function(){
        processImage();
    });
});

function processImage() {
     // 設定 subscriptionKey 變量
    var subscriptionKey = "7f69e48f0ed54be5b10bbac589464ef2";
    //確認區域與所選擇的相同或使用客製化端點網址
    var url = "https://eastus.api.cognitive.microsoft.com/";
    var uriBase = url + "vision/v3.1/analyze";
    
    var params = {
        "visualFeatures": "Adult",
        "details": "",
        "language": "en",
    };
    
    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;
    
    $.ajax({
        url: uriBase + "?" + $.param(params),
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    .done(function(data) {
        //顯示JSON內容
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        
        //檢查是否包含色情或血腥暴力內容
        if (data.adult.isAdultContent || data.adult.isRacyContent || data.adult.isGoryContent) {
            $("#picDescription").text("該影集可能包含血腥或暴力內容，不宜18歲以下觀看");
        } else {
            $("#picDescription").text("該影集適合闔家觀看");
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        //丟出錯誤訊息
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
};
