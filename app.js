const KEY="myhomeindia_v1";
let data=JSON.parse(localStorage.getItem(KEY)||'{"income":0,"otherIncome":0,"expenses":[],"emis":[],"reminders":[],"help":[]}');
const money=n=>"₹"+Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:0});
const save=()=>{localStorage.setItem(KEY,JSON.stringify(data));render();setTimeout(()=>{try{updateAdvice()}catch(e){}},0)};
function toast(t){const e=document.getElementById("toast");e.textContent=t;e.style.display="block";setTimeout(()=>e.style.display="none",1800)}
function openModal(id){document.getElementById(id).classList.add("open")}
function closeModal(id){document.getElementById(id).classList.remove("open")}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".tab-panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.getElementById(b.dataset.tab).classList.add("active")});
document.getElementById("themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("myhome_theme",document.body.classList.contains("dark")?"dark":"light")};
if(localStorage.getItem("myhome_theme")==="dark")document.body.classList.add("dark");

function render(){
 const income=Number(data.income)+Number(data.otherIncome);
 const expenses=data.expenses.reduce((s,x)=>s+Number(x.amount),0);
 const emis=data.emis.reduce((s,x)=>s+Number(x.emi),0);
 const surplus=income-expenses-emis;
 document.getElementById("incomeValue").textContent=money(income);
 document.getElementById("expenseValue").textContent=money(expenses);
 document.getElementById("emiValue").textContent=money(emis);
 document.getElementById("surplusValue").textContent=money(surplus);
 document.getElementById("expenseCount").textContent=`${data.expenses.length} expense${data.expenses.length===1?"":"s"}`;
 document.getElementById("snapIncome").textContent=money(income);
 document.getElementById("emiRatio").textContent=income?Math.round(emis/income*100)+"%":"0%";
 document.getElementById("savingsRate").textContent=income?Math.max(0,Math.round(surplus/income*100))+"%":"0%";
 document.getElementById("annualSurplus").textContent=money(surplus*12);
 document.getElementById("salary").value=data.income||"";
 document.getElementById("otherIncome").value=data.otherIncome||"";
 renderList("expenseList",data.expenses,(x,i)=>`<div class="list-item"><div class="item-main"><b>${esc(x.desc)}</b><small>${esc(x.cat)}</small></div><span class="amount">${money(x.amount)} <button class="delete" onclick="removeItem('expenses',${i})">×</button></span></div>`);
 renderList("emiList",data.emis,(x,i)=>`<div class="list-item"><div class="item-main"><b>${esc(x.name)}</b><small>${money(x.outstanding)} outstanding · ${x.months||0} months</small></div><span class="amount">${money(x.emi)} <button class="delete" onclick="removeItem('emis',${i})">×</button></span></div>`);
 renderList("reminderList",data.reminders,(x,i)=>`<div class="list-item"><div class="item-main"><b>${esc(x.name)}</b><small>${x.date}</small></div><button class="delete" onclick="removeItem('reminders',${i})">×</button></div>`);
 const hl=document.getElementById("helpList");hl.classList.toggle("empty",!data.help.length);hl.innerHTML=data.help.length?data.help.map((x,i)=>`<div class="help"><b>${esc(x.name)}</b><span>${esc(x.role)} · ${money(x.salary)}/month · ${x.days} days</span><button class="delete" onclick="removeItem('help',${i})">Remove</button></div>`).join(""):"Add your maid, cook, driver or other household help.";
}
function renderList(id,arr,fn){const e=document.getElementById(id);e.classList.toggle("empty",!arr.length);e.innerHTML=arr.length?arr.map(fn).join(""):e.textContent}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function removeItem(k,i){data[k].splice(i,1);save();toast("Removed")}
function saveFinance(){data.income=Number(document.getElementById("salary").value||0);data.otherIncome=Number(document.getElementById("otherIncome").value||0);save();toast("Income saved")}
function addExpense(){let d=document.getElementById("eDesc").value,a=Number(document.getElementById("eAmount").value||0);if(!d||!a)return toast("Enter description and amount");data.expenses.unshift({desc:d,cat:document.getElementById("eCat").value,amount:a});closeModal("expenseModal");["eDesc","eAmount"].forEach(x=>document.getElementById(x).value="");save();toast("Expense added")}
function addEmi(){let n=document.getElementById("lName").value,e=Number(document.getElementById("lEmi").value||0);if(!n||!e)return toast("Enter loan name and EMI");data.emis.push({name:n,emi:e,outstanding:Number(document.getElementById("lOutstanding").value||0),months:Number(document.getElementById("lMonths").value||0)});closeModal("emiModal");save();toast("EMI added")}
function addReminder(){let n=document.getElementById("rName").value,d=document.getElementById("rDate").value;if(!n||!d)return toast("Enter reminder and date");data.reminders.push({name:n,date:d});data.reminders.sort((a,b)=>a.date.localeCompare(b.date));closeModal("reminderModal");save();toast("Reminder added")}
function addHelp(){let n=document.getElementById("hName").value,s=Number(document.getElementById("hSalary").value||0);if(!n||!s)return toast("Enter name and salary");data.help.push({name:n,role:document.getElementById("hRole").value||"Household help",salary:s,days:Number(document.getElementById("hDays").value||26)});closeModal("helpModal");save();toast("Added")}
function calcMaid(){let s=+mSalary.value||0,d=+mDays.value||26,l=+mLeave.value||0,a=+mAdvance.value||0;let daily=s/d,net=Math.max(0,s-daily*l-a);maidResult.innerHTML=`<b>Estimated salary: ${money(net)}</b><br>Unpaid leave deduction: ${money(daily*l)}<br>Advance deduction: ${money(a)}`}
function calcEmergency(){let e=+efExpenses.value||0,f=+efFund.value||0,m=+efMonths.value||6,target=e*m;efResult.innerHTML=`<b>Target fund: ${money(target)}</b><br>Current fund covers <b>${e?(f/e).toFixed(1):0} months</b> of essential expenses.<br>Additional amount needed: ${money(Math.max(0,target-f))}`}
function calcRent(){let r=+rent.value||0,b=(+buyEmi.value||0)+(+buyCosts.value||0);rentResult.innerHTML=`<b>Rent: ${money(r)}/month</b><br>Estimated ownership cost: ${money(b)}/month<br><br>${b>r?`Ownership costs are ${money(b-r)} higher per month in this simple comparison.`:`Ownership costs are ${money(r-b)} lower per month in this simple comparison.`}`}
function simulateLoan(){let p=+simPrincipal.value||0,annual=+simRate.value||0,n=+simTenure.value||0,r=annual/1200;let emi=r? p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):n?p/n:0;let income=Number(data.income)+Number(data.otherIncome),current=data.emis.reduce((s,x)=>s+Number(x.emi),0),newRatio=income?(current+emi)/income*100:0;simResult.innerHTML=`<b>Estimated EMI: ${money(emi)}/month</b><br>Total interest: ${money(Math.max(0,emi*n-p))}<br>New EMI ratio: ${newRatio.toFixed(1)}% of monthly income`}

function clearAll(){if(confirm("Delete all MyHome India data from this browser?")){localStorage.removeItem(KEY);location.reload()}}
render();
setTimeout(()=>{try{updateAdvice()}catch(e){}},0);
function baseMonthly(){return data.expenses.reduce((s,x)=>s+Number(x.amount),0)+data.emis.reduce((s,x)=>s+Number(x.emi),0)}
function calculateTrueCost(){
 const quarterly=+document.getElementById("qSchool").value||0;
 const annual=[aInsurance,aTravel,aMaintenance,aFestival,aOther].reduce((s,e)=>s+(+e.value||0),0);
 const monthlyAnnual=annual/12, trueMonthly=baseMonthly()+quarterly/3+monthlyAnnual;
 const income=Number(data.income)+Number(data.otherIncome), surplus=income-trueMonthly;
 document.getElementById("trueCost").textContent=money(trueMonthly);
 document.getElementById("annualCost").textContent=money(trueMonthly*12);
 document.getElementById("dailyCost").textContent=money(trueMonthly/30);
 document.getElementById("bufferMonths").textContent=surplus>0?(Math.max(0,Number(data.emergencyFund||0)/surplus).toFixed(1)+" mo"):"—";
 document.getElementById("lifeSnapshot").innerHTML=`<div><span>Regular monthly costs</span><b>${money(baseMonthly())}</b></div><div><span>Quarterly costs / month</span><b>${money(quarterly/3)}</b></div><div><span>Annual costs / month</span><b>${money(monthlyAnnual)}</b></div><div><span>True monthly surplus</span><b class="${surplus>=0?"positive":"negative"}">${money(surplus)}</b></div>`;
 renderLifeCalendar(quarterly,annual);
 updateAdvice();
}
function renderLifeCalendar(quarterly,annual){
 const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
 const q=quarterly/3, a=annual/12, base=baseMonthly(), vals=months.map((m,i)=>base+a+(i%3===2?quarterly:0));
 const max=Math.max(...vals), min=Math.min(...vals);
 document.getElementById("expenseCalendar").innerHTML=vals.map((v,i)=>`<div class="month-card ${v===max?"highlight":""}"><b>${months[i]}</b><span>${money(v)}</span><small>${v===max?"Higher-cost month":"Estimated family cost"}</small></div>`).join("")+`<div class="calendar-note">Highest estimated month: ${months[vals.indexOf(max)]} at ${money(max)}. This simple planner spreads annual costs evenly and places quarterly costs in every third month.</div>`;
}
function getCutSuggestions(requiredSaving){
  const cats={};
  data.expenses.forEach(x=>{
    const amount=Number(x.amount)||0;
    const cat=x.cat||"Other";
    cats[cat]=(cats[cat]||0)+amount;
  });
  const priorities=[
    ["Entertainment",0.35,"Review entertainment, streaming and discretionary spending"],
    ["Dining",0.30,"Reduce eating out, food delivery and discretionary dining"],
    ["Transport",0.20,"Review cab, fuel and discretionary travel costs"],
    ["Shopping",0.25,"Reduce non-essential shopping and impulse purchases"],
    ["Subscriptions",0.50,"Review unused subscriptions and recurring services"],
    ["Other",0.20,"Review miscellaneous and non-essential spending"],
    ["Groceries",0.10,"Optimise grocery purchases, brands and food waste"],
    ["Home Maintenance",0.10,"Defer or negotiate non-urgent home maintenance where practical"]
  ];
  let suggestions=[];
  priorities.forEach(([cat,rate,text])=>{
    if(cats[cat]>0){
      const saving=Math.round(cats[cat]*rate);
      if(saving>0)suggestions.push({cat,saving,text,base:cats[cat]});
    }
  });
  const sorted=suggestions.sort((a,b)=>b.saving-a.saving);
  let remaining=requiredSaving;
  const selected=[];
  for(const s of sorted){
    if(remaining<=0)break;
    const target=Math.min(s.saving,remaining);
    selected.push({...s,saving:target});
    remaining-=target;
  }
  if(remaining>0){
    const emiExpenses=data.emis.reduce((s,x)=>s+Number(x.emi||0),0);
    if(emiExpenses>0){
      selected.push({cat:"Loans / EMIs",saving:remaining,text:"Consider extending the purchase timeline or evaluating loan prepayment/refinancing options before adding another EMI. Do not increase debt solely to meet the target.",base:emiExpenses});
      remaining=0;
    }
  }
  return {selected,remaining};
}

function checkAffordability(){
 const price=+affordPrice.value||0, down=+affordDown.value||0, annual=+affordRate.value||0, n=+affordTenure.value||0, running=+affordRunning.value||0, one=+affordOneTime.value||0;
 const p=Math.max(0,price-down), r=annual/1200;
 const emi=r&&n?p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):(n?p/n:0);
 const income=Number(data.income)+Number(data.otherIncome), current=baseMonthly(), currentSurplus=income-current;
 const impact=emi+running, newSurplus=currentSurplus-impact, newTrue=current+impact;
 const oneTimeCash=Math.max(0,down)+one;
 const targetBuffer=Math.max(0,impact-currentSurplus);
 const ratio=income?((current+impact)/income*100):0;
 let status, pill, headline;
 if(income<=0){
   status="yellow"; pill="Working — add income data"; headline="Add your monthly income to assess affordability.";
 } else if(newSurplus>=0 && ratio<=40){
   status="green"; pill="Good — potentially affordable"; headline=`The purchase leaves an estimated ${money(newSurplus)} monthly surplus.`;
 } else if(newSurplus>=0){
   status="yellow"; pill="Warning — limited buffer"; headline=`The purchase leaves an estimated ${money(newSurplus)} monthly surplus, but your monthly cost ratio would be about ${ratio.toFixed(1)}%.`;
 } else {
   status="red"; pill="Working needed — not affordable yet"; headline=`You would have an estimated ${money(Math.abs(newSurplus))} monthly shortfall.`;
 }
 document.getElementById("affordResult").innerHTML=
 `<span class="status-pill status-${status}">${pill}</span><br><b>${headline}</b><br><br>
 <b>Estimated EMI:</b> ${money(emi)}<br>
 <b>Running cost:</b> ${money(running)}/month<br>
 <b>Additional monthly impact:</b> ${money(impact)}<br>
 <b>New true monthly cost:</b> ${money(newTrue)}<br>
 <b>Current monthly surplus:</b> ${money(currentSurplus)}<br>
 <b>After purchase:</b> <span class="${newSurplus>=0?"positive":"negative"}">${money(newSurplus)}</span><br>
 <b>Estimated monthly cost ratio:</b> ${ratio.toFixed(1)}%<br>
 <b>One-time cash needed:</b> ${money(oneTimeCash)}<br>
 <b>Annual cash-flow impact:</b> ${money(impact*12)}`;

 const plan=document.getElementById("cutPlan");
 if(newSurplus>=0){
   plan.innerHTML=`<h4>💡 Expense-cutting suggestions</h4><div>You don't need to cut expenses based on the current numbers. If you want a bigger safety buffer, review your largest discretionary categories below.</div>`;
 }else{
   const needed=Math.abs(newSurplus);
   const {selected,remaining}=getCutSuggestions(needed);
   let html=`<h4>✂️ How could you make this purchase possible?</h4>
   <div>You need to free up approximately <span class="saving">${money(needed)}/month</span> to keep your current monthly cash flow from going negative.</div>`;
   if(selected.length){
     html+=`<ul>${selected.map(s=>`<li><b>${esc(s.cat)} — target ${money(s.saving)}/month:</b> ${esc(s.text)}. Current ${esc(s.cat).toLowerCase()} spend: ${money(s.base)}/month.</li>`).join("")}</ul>`;
   }
   if(remaining>0){
     html+=`<p><b>Remaining gap:</b> ${money(remaining)}/month. Consider reducing the purchase price, increasing the down payment, choosing a longer/less expensive financing option, or delaying the purchase.</p>`;
   }else{
     html+=`<p><b>Potential target:</b> The suggestions above are designed to close the estimated monthly gap. They are not guarantees and should be reviewed against your actual priorities.</p>`;
   }
   plan.innerHTML=html;
 }
}

function updateMakePossible(){
 const price=+document.getElementById("mpPrice").value||0;
 const downPct=+document.getElementById("mpDown").value||0;
 const n=+document.getElementById("mpTenure").value||60;
 const rate=(+document.getElementById("affordRate").value||9)/1200;
 const income=Number(data.income)+Number(data.otherIncome);
 const current=baseMonthly();
 const surplus=income-current;
 const down=price*downPct/100;
 const principal=Math.max(0,price-down);
 const emi=rate&&n?principal*rate*Math.pow(1+rate,n)/(Math.pow(1+rate,n)-1):(n?principal/n:0);
 const running=+document.getElementById("affordRunning").value||0;
 const impact=emi+running;
 const after=surplus-impact;
 document.getElementById("mpPriceOut").textContent=money(price);
 document.getElementById("mpDownOut").textContent=downPct+"%";
 document.getElementById("mpTenureOut").textContent=n+" months";
 const status=after>=0?"🟢 Fits current cash flow":"🔴 Still above current cash flow";
 document.getElementById("makePossibleResult").innerHTML=`
   <b>${status}</b>
   <div class="scenario-grid">
     <div class="scenario"><small>Estimated EMI</small><b>${money(emi)}</b></div>
     <div class="scenario"><small>Monthly impact</small><b>${money(impact)}</b></div>
     <div class="scenario"><small>Surplus after purchase</small><b class="${after>=0?"positive":"negative"}">${money(after)}</b></div>
   </div>
   <p>${after>=0
     ? "This scenario fits the current monthly cash-flow model. Keep a safety buffer rather than using the entire surplus."
     : "This scenario does not fit yet. Try increasing the down payment, extending tenure, reducing the purchase price, or use the expense-cutting suggestions above."}</p>`;
}

function updateAdvice(){
 const base=Number(document.getElementById("trueCost")?.textContent?.replace(/[^0-9.-]/g,"")||0);
 const currentCost=base||baseMonthly();
 const income=Number(data.income)+Number(data.otherIncome);
 const inflation=Math.max(0,+document.getElementById("adInflation").value||0);
 const salaryHike=Math.max(0,+document.getElementById("adSalaryHike").value||0);
 let expenseGrowth=Math.max(0,+document.getElementById("adExpenseGrowth").value||0);
 const last=+document.getElementById("adLastMonth").value||0;
 const three=+document.getElementById("adThreeMonth").value||0;
 const six=+document.getElementById("adSixMonth").value||0;
 let trendText="Using your planned expenditure-growth assumption.";
 if(last>0 && six>0){
   const months=6;
   const actual=Math.pow(last/six,1/months)-1;
   if(Number.isFinite(actual)) expenseGrowth=Math.max(0,actual*100),trendText=`Your entered 6-month expenditure trend is ${actual>=0?"up":"down"} ${Math.abs(actual*100).toFixed(1)}% annualised (approx.).`;
 }else if(last>0 && three>0){
   const actual=Math.pow(last/three,1/3)-1;
   if(Number.isFinite(actual)) expenseGrowth=Math.max(0,actual*100),trendText=`Your entered 3-month expenditure trend is ${actual>=0?"up":"down"} ${Math.abs(actual*100).toFixed(1)}% annualised (approx.).`;
 }
 const expenseRate=Math.max(inflation,expenseGrowth);
 const years=5;
 let proj=[];
 for(let y=0;y<=years;y++){
   const c=currentCost*Math.pow(1+expenseRate/100,y);
   const inc=income*Math.pow(1+salaryHike/100,y);
   proj.push({y,c,inc,s:inc-c});
 }
 const gapNow=income-currentCost;
 const gap5=proj[5].s;
 const costGrowth=Math.pow(1+expenseRate/100,5)-1;
 const incomeGrowth=Math.pow(1+salaryHike/100,5)-1;
 const marginNow=income?gapNow/income*100:0;
 const margin5=proj[5].inc?gap5/proj[5].inc*100:0;
 let status, headline;
 if(income<=0){status="yellow";headline="Enter salary/income to generate the household advice."}
 else if(gapNow<0){status="red";headline=`Your current model is short by ${money(Math.abs(gapNow))} per month. The first goal is to restore a positive monthly surplus before adding new lifestyle costs.`}
 else if(salaryHike>expenseRate+1){status="green";headline="Your assumed salary growth is ahead of expenditure growth. Protect that advantage by preventing lifestyle costs from rising at the same pace as income."}
 else {status="yellow";headline="Your projected income and expenditure are growing at similar rates. A spending ceiling is important so future raises do not get absorbed by lifestyle inflation."}
 document.getElementById("adviceSummary").innerHTML=`<b>${status==="green"?"🟢":status==="yellow"?"🟡":"🔴"} ${headline}</b><br><br><b>Current surplus:</b> ${money(gapNow)} (${marginNow.toFixed(1)}% of income)<br><b>Assumed expenditure growth:</b> ${expenseRate.toFixed(1)}% p.a. &nbsp; <b>Salary growth:</b> ${salaryHike.toFixed(1)}% p.a.<br><b>5-year income growth:</b> ${(incomeGrowth*100).toFixed(1)}% &nbsp; <b>5-year cost growth:</b> ${(costGrowth*100).toFixed(1)}%<br><b>5-year projected monthly surplus:</b> <span class="${gap5>=0?"trend-down":"trend-up"}">${money(gap5)}</span><br><small>${trendText}</small>`;
 document.getElementById("projectionGrid").innerHTML=proj.map(p=>`<div class="projection-card"><span class="year">Year ${p.y}</span><small>Projected income</small><b>${money(p.inc)}</b><small>Projected family cost</small><b>${money(p.c)}</b><small>Surplus</small><b class="${p.s>=0?"trend-down":"trend-up"}">${money(p.s)}</b></div>`).join("");
 const gap=Math.max(0,-gapNow);
 const targetSurplus=Math.max(0,income*0.15);
 const neededToTarget=Math.max(0,targetSurplus-gapNow);
 let actions=[];
 if(gap>0) actions.push(`Restore at least ${money(gap)} per month of positive cash flow before taking on new discretionary commitments.`);
 if(neededToTarget>0) actions.push(`Target an initial monthly surplus of about ${money(targetSurplus)} (15% of income in this model), requiring roughly ${money(neededToTarget)} more monthly room.`);
 if(salaryHike<=expenseRate) actions.push(`When salary rises, cap regular lifestyle-expense growth at about ${Math.min(expenseRate,salaryHike-1<0?0:salaryHike-1).toFixed(1)}% rather than allowing expenses to track the full raise.`);
 actions.push(`Treat at least part of every salary increase as unavailable for lifestyle spending: direct it first toward emergency reserves, debt reduction or long-term goals.`);
 actions.push(`Review discretionary categories monthly; if a category rises faster than your household inflation assumption for two consecutive months, set a spending cap for it.`);
 actions.push(`Keep annual and quarterly costs in the monthly budget. This prevents school fees, insurance, travel and festival spending from appearing as unexpected shocks.`);
 document.getElementById("maintenancePlan").innerHTML=`<h4>🛠️ How to maintain expenditure</h4><ul>${actions.map(a=>`<li>${a}</li>`).join("")}</ul><p><b>Personalised cut-down logic:</b> Use <b>Can I Afford This?</b> above when considering a major purchase. If it creates a deficit, MyHome India will use your entered discretionary categories to identify potential reductions rather than applying a generic percentage.</p>`;
}
