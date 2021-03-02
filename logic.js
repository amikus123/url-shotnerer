const toggle = document.getElementById("nav-toggle");
const nav = document.getElementById("top-nav");
const body = document.getElementById("body");
console.log(body);
// checking whether element is either nav or body
const bodyOrNav = (element) => {
  if (element === body) {
    return true;
  } else if (element === nav) {
    return false;
  } else {
    return bodyOrNav(element.parentElement);
  }
};
// event that closes menu while click on any other element
const bodyEvent = (e) => {
  if (bodyOrNav(e.target)) {
    nav.classList.remove("visible-nav");
    setTimeout(() => {
      nav.classList.remove("trans");
    }, 500);
    closeMenu();
  }
};

const operMenu = () => {
  nav.classList.add("trans");
  nav.classList.add("visible-nav");

  toggle.classList = "fas fa-times";
  setTimeout(() => {
    body.addEventListener("click", bodyEvent);
  }, 0);
};

const closeMenu = () => {
  nav.classList.remove("visible-nav");
  toggle.classList = "fas fa-bars";

  setTimeout(() => {
    body.removeEventListener("click", bodyEvent);
    console.log("removed evbent");
  }, 0);
  setTimeout(() => {
    nav.classList.remove("trans");
  }, 500);
};

toggle.addEventListener("click", () => {
  if (nav.classList.contains("visible-nav")) {
    closeMenu();
  } else {
    operMenu();
  }
});

// fetching
const baseUrl = `https://api.shrtco.de/v2/shorten?url=`;
const form = document.getElementById("form");
const text = document.getElementById("text");
const list = document.getElementById("list");

// this function adds element to html, shoudl be reun after every call and upon refreshing
const addToHTML = (og, short) => {
  // it is used to get item index at the time of creation
  console.log('createrd')
  let curr = localStorage.getItem("pages");
  curr = JSON.parse(curr);
  // static link
  const li = document.createElement("li");
  li.classList = "saved-link";
  const fl = document.createElement("span");
  fl.classList = "first-link";
  fl.innerHTML = og;
  // copy link
  const sl = document.createElement("span");
  sl.classList = "second-link";
  sl.innerHTML = short;
  // copy buttonm
  const cop = document.createElement("button");
  cop.classList = "square copy";
  cop.innerHTML = "Copy&nbsp;it!";
  // delete button
  const del = document.createElement("button");
  del.classList = "square red delete";
  del.innerHTML = "Delete&nbsp;it!";
  del.addEventListener("click", () => {
    removeFromLocal(short);
    li.style = "margin-left:200vw; opacity:0";
    goUp(short)
    setTimeout(()=>{
      li.remove()
    },1000)
  });
  li.appendChild(fl);
  li.appendChild(sl);
  li.appendChild(cop);
  li.appendChild(del);
  list.appendChild(li);
};
// animate all from certain short name to go up
const goUp = short =>{
  const items = Array.from(document.getElementsByClassName("saved-link"));
  // this is array of all items
  // znajduje indeks elementu o pewnej nazwie, wszystkie nziej animuje
  const arr = []
  items.forEach(item=>{
    console.log(item.children[1])
    arr.push(item.children[1])
  })
  let maxIndex;
  arr.forEach((item,index)=>{
    if(item.innerHTML===short){
      maxIndex = index;
    }
  })
  console.log(arr,maxIndex)
  for(let i=maxIndex+1;i<items.length;i++){
    items[i].style="transform: translateY(-94px); transition:  1s;"
    setTimeout(()=>{
      items[i].style="transition: 0s;"
    },1000)
  }
  
}
//add item to local storage based on results
const addToLocal = (og, short) => {
  console.log(og, short);
  let entry = {
    long: og,
    short: short,
  };

  if (localStorage.getItem("pages").length < 1) {
    entry = [entry];
    entry = JSON.stringify(entry);
    localStorage.setItem("pages", [entry]);
    addToHTML(og, short);

  } else {
    let curr = localStorage.getItem("pages");
    curr = JSON.parse(curr);
    curr.push(entry);
    localStorage.setItem("pages", JSON.stringify(curr));
    addToHTML(og, short);

  }
};

const shortUrlCall = (inp) => {
  fetch(baseUrl + inp, {
    method: "GET",
  })
    .then((data) => data.json())
    .then((json) => {
      if (json.ok) {
        console.log(json.result);
        addToLocal(json.result.original_link, json.result.short_link);
      } else {
        console.log(json);
      }
    })
    .catch((err) => {
      console.log(err, "blad serwera");
    });
};


form.addEventListener("submit", (e) => {
  e.preventDefault();
  shortUrlCall(text.value);
});

if (!localStorage.getItem("pages")) {
  localStorage.setItem("pages", []);
}

if (localStorage.getItem("pages").length > 0) {
  const localArray = JSON.parse(localStorage.getItem("pages"));
  localArray.forEach((item,index) => {
    addToHTML(item.long, item.short);
  });
}

// const items = Array.from(document.getElementsByClassName("saved-link"));
// const links = Array.from(document.getElementsByClassName("second-link"));
// const copies = Array.from(document.getElementsByClassName("copy"));
// const deletes = Array.from(document.getElementsByClassName("delete"));
const removeFromLocal = (short) => {
  // zamienie na array potem podimeinie i usune
  let curr = localStorage.getItem("pages");
  curr = JSON.parse(curr);
  console.log(curr)
  const notCopy = og =>{
    return og.short !== short;
  }
  curr = curr.filter(notCopy)
  console.log(curr)
  localStorage.setItem("pages", JSON.stringify(curr));
  
};
