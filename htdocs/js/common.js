/* Global(전역)변수 */
let setting = {
    defaultPage : 'main',
    initialPage : 1,
    listCnt : 5,  // max-listCnt : 5
    pageLimit : 4
}

htmlLoad();







function htmlLoad() {
    page = new URL(location.href).searchParams.get('page');
    if(page){
        setting.initialPage = page;
    }
    let url = window.location.pathname;
    if(url == '/') {
        url = '/'+setting.defaultPage
    }
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url+'.html', true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if(xhr.readyState === xhr.DONE){
            if(xhr.status === 200 || xhr.status === 201){
                if(url == '/main'){
                    getData_main();
                    document.querySelector('html').innerHTML = xhr.responseText;
                }
                if(url == '/school/list') {
                    kakaomap();
                    document.querySelector('body').style.visibility = 'visible';
                }
                if(url == '/school/list' || url == '/teacher/list' || url == '/quiz/card-list' || url == '/quiz/ox-list' || url == '/game/list' || url == '/game/detail'){
                    getData();
                }
            }
        }
    }

}

function setup() {

}

// JSON 통신 list 뿌리기
function getData() {
    pageName = window.location.pathname;
    pageName = pageName.split('/');
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/json/' + pageName[1] + ''+pageName[2] + setting.initialPage+'.json')
    xhr.send();
    xhr.onreadystatechange = function() {
        if(xhr.status === 200 || xhr.status === 201) {
            getList(JSON.parse(xhr.responseText), pageName)
        } else if(xhr.status === 404 || xhr.status === 403){
            window.location.href = '/404';
        }
    }
}

// JSON list 데이터 출력
function getList(getList, pageName){
    let table = '.contentDataList';
    let tbody = document.querySelector(table);
    let tr = document.querySelector(table+"tr");
    let td = document.querySelectorAll(table+" td");
    pager(getList.total);
    sortTable();

    if(getList.state == 0000 && pageName[1] == 'teacher') {
        tbody.innerHTML = '';
        for(let i=0; i<setting.listCnt; i++){
            td[0].innerHTML = getList.data[i].no;

        }
    } else if(getList.state == 0000 && pageName[1] == 'school'){

    }

}

// pager
function pager(totalData){

}

// list sort
function sortTable(n){

}

/***************************************************************************
 API
 ***************************************************************************/

/* kakaomap API */
function kakaomap() {
    let map = new kakao.maps.Map(document.getElementById('school-map-l'), {
        center : new kakao.maps.LatLng(36.2683, 127.6358),
        level : 13
    });
    let clusterer = new kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 10
    });
    $.get("/json/map.json", function(data) {
        let markers = $(data.positions).map(function(i, position) {
            return new kakao.maps.Marker({
                position : new kakao.maps.LatLng(position.lat, position.lng)
            });
        });
        clusterer.addMarkers(markers);
    });
}

/* kakaozipcode API */
function sample4_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            let fullRoadAddr = data.roadAddress; // 도로명 주소 변수
            let extraRoadAddr = ''; // 도로명 조합형 주소 변수

            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                extraRoadAddr += data.bname;
            }

            if(data.buildingName !== '' && data.apartment === 'Y') {
                extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }

            if(extraRoadAddr !== '') {
                extraRoadAddr = ' (' + extraRoadAddr + ')';
            }

            if(fullRoadAddr !== '') {
                fullRoadAddr += extraRoadAddr;
            }

            document.getElementById('sample4_postcode').value = data.zonecode; //5자리 새우편번호 사용
            document.getElementById('sample4_roadAddress').value = fullRoadAddr;
            document.getElementById('sample4_jibunAddress').value = data.jibunAddress;

            if(data.autoRoadAddress) {
                let expRoadAddr = data.autoRoadAddress + extraRoadAddr;
                document.getElementById('guide').innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';
            } else if(data.autoJibunAddress) {
                let expJibunAddr = data.autoJibunAddress;
                document.getElementById('guide').innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';
            }
        }
    }).open();
}