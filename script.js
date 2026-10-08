(function(){
  "use strict";
  // ---- Settings you can change ----
  var EXIT_URL = "https://www.google.com/search?q=weather";   // neutral page
  var FORM_ENDPOINT = "";  // EDIT: your secure server address for form submissions

  // ---- Quick exit ----
  function quickExit(){
    var f=document.getElementById("contactForm"); if(f) f.reset();
    window.location.replace(EXIT_URL);  // replace keeps this page out of Back-button history
  }
  document.getElementById("exitBtn").addEventListener("click",quickExit);
  document.addEventListener("keydown",function(e){ if(e.key==="Escape") quickExit(); });

  // ---- Language switch (English / Tok Pisin) ----
  var nodes=[].slice.call(document.querySelectorAll("[data-tp]"));
  nodes.forEach(function(n){ n.setAttribute("data-en",n.innerHTML); });
  var isTP=false, btn=document.getElementById("langBtn");
  btn.addEventListener("click",function(){
    isTP=!isTP;
    nodes.forEach(function(n){ n.innerHTML = isTP ? n.getAttribute("data-tp") : n.getAttribute("data-en"); });
    document.documentElement.lang = isTP ? "tpi" : "en";
    btn.textContent = isTP ? "English" : "Tok Pisin";
  });

  // ---- Contact form ----
  var form=document.getElementById("contactForm"), msg=document.getElementById("formMsg");
  function show(html){ msg.innerHTML=html; msg.classList.add("show"); msg.scrollIntoView({block:"nearest"}); }
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var danger=document.getElementById("danger").checked;
    var how=document.getElementById("how").value, detail=document.getElementById("detail").value.trim();
    if(how!=="none" && !detail){ show("Please add your phone number or email, or choose “Don’t contact me”."); return; }
    if(danger){ show("If you are in danger now, please call <a href='tel:70903300'><strong>7090 3300</strong></a> (Lae Police) or <a href='tel:71508000'><strong>7150 8000</strong></a> (24-hour helpline). Phones are faster than this form."); }
    if(!FORM_ENDPOINT){
      show((danger?msg.innerHTML+"<br><br>":"")+"<strong>This message has not been sent.</strong> The form is not yet connected to a service. Please call <a href='tel:71508000'>7150 8000</a> (free, 24 hours) to speak with someone.");
      return;
    }
    var data={nick:form.nick.value,how:how,detail:detail,when:form.when.value,story:form.story.value,danger:danger};
    fetch(FORM_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)})
      .then(function(r){ if(!r.ok) throw new Error(); form.reset();
        show("Thank you. Your message has been received. If you asked us to contact you, we will do so at the time you gave."); })
      .catch(function(){ show("Your message could not be sent. Please call <a href='tel:71508000'>7150 8000</a> (free, 24 hours) instead."); });
  });
})();
