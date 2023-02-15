/**
 * 계산 관련 코드는 전부 statement() 함수로 모으고 renderPlainText()는 data 매개변수로 전달된 데이터만 처리하게 만들기
 */
function statement(invoice, plays) {
  const statementData = {};  // 중간 데이터 구조를 인수로 전달
  statementData.customer = invoice.customer;  // 고객 데이터를 중간 데이터로 옮김
  statementData.performances = invoice.performances.map(enrichPerformance);  // 공연 데이터를 중간 데이터로 옮김
  return renderPlainText(statementData, plays);

    // 공연 정보 레코드에 연극 데이터 추가하는 함수
    function enrichPerformance(aPerformance) {
      const result = Object.assign({}, aPerformance);  // 얕은 복사 수행
      // 얕은 복사 이유? 함수로 건넨 데이터를 수정하기 싫어서! 최대한 불변처럼 취급
      return result;
    }

  // 본문 전체를 별도 함수로 추출
  function renderPlainText(data, plays) {
    let result = `청구 내역 (고객명: ${data.customer})\n`;  // 고객 데이터를 중간 데이터로부터 얻음
    for (let perf of data.performances) {
      // 청구 내역 출력
      result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    }
    result += `총액: ${usd(totalAmount)}\n`;
    result += `적립 포인트: ${totalVolumeCredits()}점\n`;
    return result;

    function totalAmount() {
      let result = 0;
      for (let perf of data.performances) {
        result += amountFor(perf);
      }
      return result;
    }

    function amountFor(aPerformance) {
      let result = 0;
      switch (playFor(aPerformance).type) { 
        case "tragedy":
          result = 40000;
          if (aPerformance.audience > 30) {
            result =+ 1000 * (aPerformance.audience - 30);
          }
          break;
        case "comedy":
          result = 30000;
          if (aPerformance.audience > 20) {
            result += 10000 +500 * (aPerformance.audience - 20);
          }
          result += 300 * aPerformance.audience; break;
        default:
          throw new Error();
        }
      return result;
    }
    
    function playFor(aPerformance) {
      return plays[aPerformance.playID];
    }
    
    function volumeCreditsFor(aPerformance) {
      let volumeCredits = 0;
      volumeCredits =+ Math.max(aPerformance .audience - 30, 0);
      if ("comedy" === playFor (aPerformance). type) {
        volumeCredits =+ Math. floor (aPerformance.audience / 5);
      }
      return volumeCredits;
    }
    
    function usd(aNumber) {
      return new Intl.NumberFormat(
        "en-US",
        {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2
        }
      ).format(aNumber / 100);
    }
    
    function totalVolumeCredits() {
      let volumeCredits = 0;
      for (let perf of data.performances) {
        volumeCredits = volumeCreditsFor(perf);
      }
      return volumeCredits;
    }
  }
}
