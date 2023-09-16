const scriptName = "subway";

const ApiKey = "YOUR_API_KEY";
const metroApiLink = "http://swopenapi.seoul.go.kr/api/subway/" + ApiKey + "/json/realtimeStationArrival/1/100/";
const longmsg = "\n" + "\u200b".repeat(500);

const subwayID = {
    "1001": "수도권 1호선",
    "1002": "서울 2호선",
    "1003": "수도권 3호선",
    "1004": "수도권 4호선",
    "1005": "수도권 5호선",
    "1006": "서울 6호선",
    "1007": "서울 7호선",
    "1008": "서울 8호선",
    "1009": "서울 9호선",
    "1061": "중앙선",
    "1063": "경의·중앙선",
    "1065": "인천공항철도",
    "1067": "경춘선",
    "1075": "수인·분당선",
    "1077": "신분당선",
    "1092": "우이신설선",
    "1093": "수도권 서해선",
    "1081": "수도권 경강선"
};

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  try {
    if (msg.startsWith(",지하철 ")) {
      var station = msg.substr(5);
        replier.reply(station + "의 전동열차 정보\n" + longmsg + subwayPost(station));
    }
   } catch (e) {
     replier.reply("에러" + longmsg + "\n" + e + "\n" + e.lineNumber);
   }
}

const subwayPost = (stn) => {
  var jasson = JSON.parse(org.jsoup.Jsoup.connect(metroApiLink + stn).ignoreContentType(true).get().text());
  //return JSON.stringify(jasson);
  var output = [];
  var up = []; // 내선순환, 상행
  var dn = []; // 외선순환, 하행
  var total = jasson['errorMessage']['total'];
  for (var i = 0; i < total; i ++) {
    var row = jasson['realtimeArrivalList'][i];
    var updnStat = jasson['realtimeArrivalList'][i]['updnLine'];
    if (updnStat == "상행" || updnStat == "내선") {
      up.push(row);
    } else if (updnStat == "하행" || updnStat == "외선") {
      dn.push(row);
    }
  }
  
  var afterUp = [];
  var afterDn = [];
  
  var upLen = up.length;
  var dnLen = dn.length;
  
  up.sort((prev, cur) => {
      if (prev['subwayId'] > cur['subwayId']) return 1;
      if (prev['subwayId'] < cur['subwayId']) return -1;
      if (prev['subwayId'] == cur['subwayId']) return 0;
  });
  
  dn.sort((prev, cur) => {
      if (prev['subwayId'] > cur['subwayId']) return 1;
      if (prev['subwayId'] < cur['subwayId']) return -1;
      if (prev['subwayId'] == cur['subwayId']) return 0;
  });
  
  arvlccd = (arvlcCd) => {
  switch (arvlcCd) {
      case "0":
        return "진입";
        break;
        
      case "1":
        return "도착";
        break;
        
      case "3":
        return "출발"; // 전역 출발
        break;
        
      case "4":
        return "진입"; // 전역 진입
        break;
        
      case "5":
        return "도착"; // 전역 도착
        break;
        
      case "99":
        return "운행중";
        break;
        
      default:
        return "몰?루";
        break;
    }
  };
  
  trainType = (type) => {
    switch (type) {
      case "일반":
       return "완행";
       break;
       
      case "ITX":
        return "ITX-청춘";
        break;
        
      default:
        return type;
        break;
    }
  };
  
  for (var i = 0; i < upLen; i ++) {
    var bstatnnm = up[i]['bstatnNm']; // 행선지
    var btrainno = up[i]['btrainNo']; // 열차번호
    var arvlmsg2 = up[i]['arvlMsg2']; // 첫번째 도착메시지
    var arvlmsg3 = up[i]['arvlMsg3']; // 두번째 도착메시지
    var btrainsttus = up[i]['btrainSttus']; // 열차 종류
    var arvlcd = up[i]['arvlCd']; // 열차상태 코드
    var trainlinenm = up[i]['trainLineNm'];
    
    switch (up[i]['subwayId']) {
        case "1001": //수도권 1호선
          // afterUp.push("수도권 1호선\n");
          afterUp.push("수도권 1호선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus) + "열차 " + arvlmsg2 + "\n");     
          break;
          
        case "1002": // 서울 2호선
          afterUp.push("서울 2호선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + " " + trainlinenm +"\n");
          break;
          
        case "1003": // 수도권 3호선
          afterUp.push("수도권 3호선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1004": // 수도권 4호선
          afterUp.push("수도권 4호선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus) + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1005": // 수도권 5호선
          afterUp.push("수도권 5호선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1006": // 서울 6호선
          afterUp.push("서울 6호선  " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1007": // 서울 7호선
          afterUp.push("서울 7호선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1008": // 서울 8호선
          afterUp.push("서울 8호선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1009": // 서울 9호선
          afterUp.push("서울 9호선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus)+ "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1061": // 중앙선...?
          afterUp.push("중앙선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1063": // 경의·중앙선
          afterUp.push("경의·중앙선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus) + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1065": // 인천공항철도
          afterUp.push("인천공항철도 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1067": // 경춘선
          afterUp.push("경춘선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus) + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1075": // 수인·분당선
          afterUp.push("수인·분당선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus) + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1077": // 신분당선
          afterUp.push("신분당선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1092": // 우이신설선
          afterUp.push("우이신설선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1093": // 수도권 서해선
          afterUp.push("수도권 서해선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus) + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1081": //수도권 경강선
          afterUp.push("수도권 경강선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus) + "열차 " + arvlmsg2 + "\n");
          break;
      }
  }
  
  for (var i = 0; i < dnLen; i ++) {
    var bstatnnm = dn[i]['bstatnNm']; // 행선지
    var btrainno = dn[i]['btrainNo']; // 열차번호
    var arvlmsg2 = dn[i]['arvlMsg2']; // 첫번째 도착메시지
    var arvlmsg3 = dn[i]['arvlMsg3']; // 두번째 도착메시지
    var btrainsttus = dn[i]['btrainSttus']; // 열차 종류
    var arvlcd = dn[i]['arvlCd']; // 열차상태 코드
    var trainlinenm = dn[i]['trainLineNm'];
    
    switch (dn[i]['subwayId']) {
        case "1001": //수도권 1호선
          // afterUp.push("수도권 1호선\n");
          afterDn.push("수도권 1호선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus) + "열차 " + arvlmsg2 + "\n");     
          break;
          
        case "1002": // 서울 2호선
          afterDn.push("서울 2호선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + " " + trainlinenm +"\n");
          break;
          
        case "1003": // 수도권 3호선
          afterDn.push("수도권 3호선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1004": // 수도권 4호선
          afterDn.push("수도권 4호선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus) + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1005": // 수도권 5호선
          afterDn.push("수도권 5호선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1006": // 서울 6호선
          afterDn.push("서울 6호선  " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1007": // 서울 7호선
          afterDn.push("서울 7호선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1008": // 서울 8호선
          afterDn.push("서울 8호선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1009": // 서울 9호선
          afterDn.push("서울 9호선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus)+ "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1061": // 중앙선...?
          afterDn.push("중앙선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1063": // 경의·중앙선
          afterDn.push("경의·중앙선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus) + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1065": // 인천공항철도
          afterDn.push("인천공항철도 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1067": // 경춘선
          afterDn.push("경춘선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus) + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1075": // 수인·분당선
          afterDn.push("수인·분당선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus) + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1077": // 신분당선
          afterDn.push("신분당선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1092": // 우이신설선
          afterDn.push("우이신설선 " + bstatnnm + "행 " + btrainno + " " + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1093": // 수도권 서해선
          afterDn.push("수도권 서해선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus) + "열차 " + arvlmsg2 + "\n");
          break;
          
        case "1081": //수도권 경강선
          afterDn.push("수도권 경강선 " + bstatnnm + "행 " + btrainno + " " + trainType(btrainsttus) + "열차 " + arvlmsg2 + "\n");
          break;
      }
  }
  
  return "상행\n" + afterUp + "\n\n하행\n" + afterDn;
};



/*
No 	출력명 	출력설명
공통 	list_total_count 	총 데이터 건수 (정상조회 시 출력됨)
공통 	RESULT.CODE 	요청결과 코드 (하단 메세지설명 참고)
공통 	RESULT.MESSAGE 	요청결과 메시지 (하단 메세지설명 참고)
1 	subwayId 	지하철호선ID
2 	updnLine 	상하행선구분 (0 : 상행/내선, 1 : 하행/외선)
3 	trainLineNm 	도착지방면 (성수행(목적지역) - 구로디지털단지방면(다음역))
5 	statnFid 	이전지하철역ID
6 	statnTid 	다음지하철역ID
7 	statnId 	지하철역ID
8 	statnNm 	지하철역명
9 	trnsitCo 	환승노선수
10 	ordkey 	도착예정열차순번 (상하행코드(1자리), 순번(첫번째, 두번째 열차 , 1자리), 첫번째 도착예정 정류장 - 현재 정류장(3자리), 목적지 정류장, 급행여부(1자리))
11 	subwayList 	연계호선ID (1002, 1007 등 연계대상 호선ID)
12 	statnList 	연계지하철역ID (1002000233, 1007000000)
13 	btrainSttus 	열차종류 (급행,ITX,일반,특급)
14 	barvlDt 	열차도착예정시간 (단위:초)
15 	btrainNo 	열차번호 (현재운행하고 있는 호선별 열차번호)
16 	bstatnId 	종착지하철역ID
17 	bstatnNm 	종착지하철역명
18 	recptnDt 	열차도착정보를 생성한 시각
19 	arvlMsg2 	첫번째도착메세지 (도착, 출발 , 진입 등)
20 	arvlMsg3 	두번째도착메세지 (종합운동장 도착, 12분 후 (광명사거리) 등)
21 	arvlCd 	도착코드 (0:진입, 1:도착, 2:출발, 3:전역출발, 4:전역진입, 5:전역도착, 99:운행중)
*/
