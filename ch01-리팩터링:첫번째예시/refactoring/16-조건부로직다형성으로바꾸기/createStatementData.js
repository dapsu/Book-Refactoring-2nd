class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {  // amountFor() 함수의 코드를 계산기 클래스로 복사
    let result = 0;
    switch (this.play.type) { 
      case "tragedy":
        result = 40000;
        if (this.performance.audience > 30) {
          result =+ 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 +500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience; break;
      default:
        throw new Error(`알 수 없는 장르: ${this.play.type}`);
      }
    return result;
  }

  get volumeCredits() {
    let volumeCredits = 0;
    volumeCredits += Math.max(this.performance .audience - 30, 0);
    if ("comedy" === this.performance.play.type) {
      volumeCredits += Math.floor(this.performance.audience / 5);
    }
    return volumeCredits;
  }
}

export default function createresult(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;

  function enrichPerformance(aPerformance) {
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }

  function totalAmount(data) {
    return data.performances
      .reduce((total, p) => total + p.amount, 0);
  }
    
  function totalVolumeCredits(data) {
    return data.performances
      .reduce((total, p) => total + p.volumeCredits, 0);
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }
};
