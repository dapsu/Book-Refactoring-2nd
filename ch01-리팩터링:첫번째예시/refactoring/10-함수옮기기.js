 function statement(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  return renderPlainText(statementData, plays);

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);  // 중간 데이터에 연극 데이터 저장
    return result;
  }

  function playFor(aPerformance) {  // renderPlainText()의 중첩 함수였던 playFor()를 statement로 옮김
    return plays[aPerformance.playID];
  }

  function renderPlainText(data) {
    let result = `청구 내역 (고객명: ${data.customer})\n`;
    for (let perf of data.performances) {
      // 청구 내역 출력
      result += `  ${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
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
      switch (aPerformance.play.type) { 
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
          throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
        }
      return result;
    }
    
    function volumeCreditsFor(aPerformance) {
      let volumeCredits = 0;
      volumeCredits =+ Math.max(aPerformance .audience - 30, 0);
      if ("comedy" === aPerformance.play.type) {
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
