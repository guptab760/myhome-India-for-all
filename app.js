const KEY="myhomeindia_v1";
let data=JSON.parse(localStorage.getItem(KEY)||'{"income":0,"otherIncome":0,"expenses":[],"emis":[],"reminders":[],"help":[]}');
const money=n=>"₹"+Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:0});
const save=()=>{localStorage.setItem(KEY,JSON.stringify(data));render()};
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
}
function renderLifeCalendar(quarterly,annual){
 const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
 const q=quarterly/3, a=annual/12, base=baseMonthly(), vals=months.map((m,i)=>base+a+(i%3===2?quarterly:0));
 const max=Math.max(...vals), min=Math.min(...vals);
 document.getElementById("expenseCalendar").innerHTML=vals.map((v,i)=>`<div class="month-card ${v===max?"highlight":""}"><b>${months[i]}</b><span>${money(v)}</span><small>${v===max?"Higher-cost month":"Estimated family cost"}</small></div>`).join("")+`<div class="calendar-note">Highest estimated month: ${months[vals.indexOf(max)]} at ${money(max)}. This simple planner spreads annual costs evenly and places quarterly costs in every third month.</div>`;
}
function checkAffordability(){
 const price=+affordPrice.value||0, down=+affordDown.value||0, annual=+affordRate.value||0, n=+affordTenure.value||0, running=+affordRunning.value||0, one=+affordOneTime.value||0;
 const p=Math.max(0,price-down), r=annual/1200;
 const emi=r&&n?p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):(n?p/n:0);
 const income=Number(data.income)+Number(data.otherIncome), current=baseMonthly(), currentSurplus=income-current, newSurplus=currentSurplus-emi-running;
 const currentTrue=baseMonthly(), newTrue=currentTrue+emi+running;
 const impact=emi+running;
 document.getElementById("affordResult").innerHTML=`<div class="big">${money(impact)}/month additional impact</div><b>Estimated EMI:</b> ${money(emi)}<br><b>Running cost:</b> ${money(running)} / month<br><b>New true monthly cost:</b> ${money(newTrue)}<br><b>Current monthly surplus:</b> ${money(currentSurplus)}<br><b>After purchase:</b> <span class="${newSurplus>=0?"positive":"negative"}">${money(newSurplus)}</span><br><b>One-time cash needed:</b> ${money(Math.max(0,down)+one)}<br><b>Annual cash-flow impact:</b> ${money(impact*12)}<br><br>${newSurplus>=0?`The purchase leaves an estimated ${money(newSurplus)} monthly surplus based on the information entered.`:`The purchase would exceed the current estimated monthly surplus by ${money(Math.abs(newSurplus))}.`}`;
}
