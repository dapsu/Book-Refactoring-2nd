function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }
  ).format;

  for (let perf of invoice.performances) {
    // 포인트 적립
    volumeCredits = volumeCreditsFor(perf);

    // 청구 내역 출력
    result += `  ${playFor(perf).name}: ${format(amountFor(perf) /100)} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf) ;
  }
  result += `총액: ${format(totalAmount /100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
  
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
  
  // 추출한 함수에서 volumeCredits 복제본을 초기화 한 뒤 계산 결과 반환
  function volumeCreditsFor(aPerformance) {
    let volumeCredits = 0;
    volumeCredits =+ Math.max(aPerformance .audience - 30, 0);
    if ("comedy" === playFor (aPerformance). type) {
      volumeCredits =+ Math. floor (aPerformance.audience / 5);
    }
    return volumeCredits;
  }
}