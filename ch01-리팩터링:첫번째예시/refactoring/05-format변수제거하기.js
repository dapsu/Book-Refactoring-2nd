function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  for (let perf of invoice.performances) {
    // 포인트 적립
    volumeCredits = volumeCreditsFor(perf);

    // 청구 내역 출력
    result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf) ;
  }
  result += `총액: ${usd(totalAmount)}\n`;  // 임시변수였던 format을 usd함수 호출로 대체
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
  
  function volumeCreditsFor(aPerformance) {
    let volumeCredits = 0;
    volumeCredits =+ Math.max(aPerformance .audience - 30, 0);
    if ("comedy" === playFor (aPerformance). type) {
      volumeCredits =+ Math. floor (aPerformance.audience / 5);
    }
    return volumeCredits;
  }
  
  // format변수 추출
  function usd(aNumber) {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
      }
    ).format(aNumber / 100);  // 단위 변환 로직도 이 함수 안으로 이동
  }
}