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
    volumeCredits += Math.max(perf.audience - 30, 0);
    // 희극 관객 5명 마다 추가 포인트 제공
    if ("comedy" === playFor(perf).type) {
      volumeCredits += Math.floor(perf.audience / 5);
    }

    // 청구 내역 출력
    result += `  ${playFor(perf).name}: ${format(amountFor(perf) /100)} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf) ;
  }
  result += `총액: ${format(totalAmount /100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
  
  // 함수 추출하기
  function amountFor(aPerformance) {  // 값이 바뀌지 않는 변수는 매개변수로 전달
    let result = 0;  // 명확한 이름으로 변경
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
  
  // 임시 변수를 질의 함수로 바꾸기
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }
}