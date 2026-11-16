// =============================================================
// ui.js — fonctions d'AFFICHAGE
// Elles reçoivent des données et modifient la page. Elles ne changent jamais les données.
// Utilisez createElement, textContent, classList, setAttribute / dataset, append.
// (Pas de innerHTML avec des données : seulement innerHTML = "" pour vider une zone.)
// =============================================================

const typesBox = document.querySelector("#types");
const grid = document.querySelector("#grid");
const count = document.querySelector("#count");
const detail = document.querySelector("#detail");
const cartList = document.querySelector("#cart-list");
const cartCountEl = document.querySelector("#cart-count");
const cartTotalEl = document.querySelector("#cart-total");
const statsBox = document.querySelector("#stats");

// -------------------------------------------------------------
// Petites aides (déjà écrites, utilisez-les)
// -------------------------------------------------------------

/** 1 → "#001" */
export const formatNumero = (id) => "#" + String(id).padStart(3, "0");

/** 12 → "12 DH" */
export const formatPrix = (prix) => prix + " DH";

/** "Électrik" → "type-electrik" (la classe CSS de couleur du type) */
export const typeClass = (type) =>
  "type-" + type.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Crée un élément avec une classe et un texte : el("p", "card__num", "#001") */
export function el(tag, className = "", text = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== "") element.textContent = text;
  return element;
}

// -------------------------------------------------------------
// PALIER 1
// -------------------------------------------------------------

/**
 * Affiche les boutons de type dans #types.
 * counts = { Feu: 3, Eau: 3, … } (résultat de countByType) ; activeType = "Tous" ou un type.
 * Modèle d'un bouton :
 *   <button class="type-btn is-active" type="button" data-type="Feu">Feu (3)</button>
 * Le premier bouton est « Tous (12) » avec data-type="Tous" (12 = la somme des compteurs).
 * Seul le bouton du type actif a la classe is-active.
 */
export function renderTypes(counts, activeType) {
  // TODO 1. Videz #types
  const typescontainer =document.getElementById("types");
  typescontainer.innerHTML= "" ;
  // TODO 2. Créez le bouton « Tous (…) »
  const buttonTous = document.createElement("button");
  buttonTous.textContent ="Tous";
  buttonTous.dataset.type ="Tous";
  typescontainer.appendChild(buttonTous);
  // TODO 3. Pour chaque type de counts (for...in ou Object.keys), créez un bouton
  for(const type in counts){
    const button = document.createElement("button");
    button.textContent = type + "(" + counts[type] + ")" ;
    button.dataset.type = type;
    if(type === activeType){
      button.classList.add("is-active");
    }
    typescontainer.appendChild(button);
  }
}

/**
 * Affiche le nombre de cartes visibles dans #count : "5 cartes", "1 carte" ou "Aucune carte".
 */
export function renderCount(n) {
  if (n === 0) {
    count.textContent = "Aucune carte";
  } else if (n === 1) {
    count.textContent = "1 carte";
  } else {
    count.textContent = n + " cartes";
  }
}

/**
 * Affiche les cartes dans #grid.
 * list = les cartes à afficher ; cart = le panier (pour la classe is-selected, palier 2).
 * Si list est vide : un <p class="empty">Aucune carte trouvée</p>.
 * Modèle d'une carte :
 *   <article class="card" data-id="1">
 *     <img class="card__img" src="images/emberkit.svg" alt="Emberkit">
 *     <p class="card__num">#001</p>
 *     <h3 class="card__name">Emberkit</h3>
 *     <p class="card__meta"><span class="badge type-feu">Feu</span> <span class="rarity">Commune</span></p>
 *     <p class="card__price">12 DH</p>
 *     <button class="btn btn--primary" type="button" data-add="1">Ajouter</button>
 *   </article>
 * - stock 0 : classe out-of-stock sur l'article ET bouton désactivé (disabled = true)
 * - palier 2 : classe is-selected si la carte est dans le panier (cart.some(...))
 */
export function renderGrid(list, cart) {
  // TODO 1. Videz #grid
  const grid = document.getElementById("grid");
  grid.innerHTML ="";
  // TODO 2. Liste vide : ajoutez le message et arrêtez (return)
  if(list.length === 0){
    grid.innerHTML ="<p class='empty'>Aucune carte trouvée</p>"
    return;
  }
  // TODO 3. Pour chaque carte : créez l'article et ses enfants, puis grid.append(article)
  list.forEach(function(card) {
    const article = document.createElement("article");
    article.className ="card";
    article.dataset.id = card.id;
    const selected = cart.some(function(item){
      return item.id === card.id;
    });
    if(selected){
      article.classList.add("is-selected");
    }
    //verifier stock
    if(card.stock === 0){
      article.classList.add("out-of-stock");
    }
   article.innerHTML = `
  <img class="card__img" src="${card.image}" alt="${card.name}">
  <p class="card__num">#${card.id}</p>
  <h3 class="card__name">${card.name}</h3>

  <p class="card__meta">
    <span>${card.type}</span>
    <span>${card.rarity}</span>
  </p>

  <p class="card__price">${card.price} DH</p>

  <button class="btn btn--primary"
    type="button"
    data-add="${card.id}"
    ${card.stock === 0 ? "disabled" : ""}>
    Ajouter
  </button>
`;
    grid.appendChild(article) ;
  });
}

/**
 * Affiche la fiche d'une carte dans #detail : image, nom (h3), numéro + badge du type,
 * description, puis une liste <dl> : Rareté, Prix, Stock (« Rupture » si 0).
 */
export function renderDetail(card) {
  // TODO
}

// -------------------------------------------------------------
// PALIER 2
// -------------------------------------------------------------

/**
 * Affiche le panier.
 * cart = [{ id, quantite }] ; cards = toutes les cartes (pour le nom, le prix, le stock).
 * Modèle d'une ligne :
 *   <li class="cart-line" data-id="1">
 *     <span class="cart-line__name">Emberkit</span>
 *     <button class="btn btn--small" type="button" data-action="minus">−</button>
 *     <span class="cart-line__qty">2</span>
 *     <button class="btn btn--small" type="button" data-action="plus">+</button>
 *     <button class="btn btn--small" type="button" data-action="remove">Retirer</button>
 *   </li>
 * - le bouton + est désactivé quand la quantité atteint le stock
 * - panier vide : <li class="empty">Votre panier est vide</li>
 * - #cart-count : "3 cartes" (ou "1 carte", "0 carte") ; #cart-total : "54 DH"
 *   → total et nbCards sont déjà calculés par main.js (cartTotal et cartCount de cart.js)
 * - pour le nom et le stock d'une ligne, retrouvez la carte dans cards avec find
 */
export function renderCart(cart, cards, total, nbCards) {
  // TODO
  export function renderCart(cart, cards, total, nbCards) {
  // TODO

  cartList.innerHTML = "";

  // Nombre de cartes
  if (nbCards === 1) {
    cartCountEl.textContent = "1 carte";
  } else {
    cartCountEl.textContent = nbCards + " cartes";
  }

  // Total
  cartTotalEl.textContent = total + " DH";

  // Si le panier est vide
  if (cart.length === 0) {
    const message = document.createElement("li");
    message.className = "empty";
    message.textContent = "Votre panier est vide";
    cartList.appendChild(message);
    return;
  }

  // Afficher les cartes
  cart.forEach(function(item) {

    const carte = cards.find(function(card) {
      return card.id === item.id;
    });

    const ligne = document.createElement("li");
    ligne.className = "cart-line";
    ligne.dataset.id = item.id;

    const nom = document.createElement("span");
    nom.textContent = carte.name;

    const moins = document.createElement("button");
    moins.textContent = "-";
    moins.dataset.action = "minus";
    moins.type = "button";

    const quantite = document.createElement("span");
    quantite.textContent = item.quantite;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.dataset.action = "plus";
    plus.type = "button";

    if (item.quantite >= carte.stock) {
      plus.disabled = true;
    }

    const supprimer = document.createElement("button");
    supprimer.textContent = "Retirer";
    supprimer.dataset.action = "remove";
    supprimer.type = "button";

    ligne.appendChild(nom);
    ligne.appendChild(moins);
    ligne.appendChild(quantite);
    ligne.appendChild(plus);
    ligne.appendChild(supprimer);

    cartList.appendChild(ligne);

  });
}
}

// -------------------------------------------------------------
// PALIER 3 (bonus)
// -------------------------------------------------------------

/**
 * Affiche les statistiques dans #stats : 4 blocs
 *   <div class="stat"><p class="stat__value">1 234 DH</p><p class="stat__label">Valeur du stock</p></div>
 */
export function renderStats(stats) {
  // TODO
}

/**
 * Affiche les erreurs du formulaire : errors = { nom: "…", prix: "…" }
 * Pour chaque champ (nom, prix, stock) : écrit le message dans [data-error-for="…"]
 * et ajoute ou retire la classe field-error sur le champ #form-….
 */
export function showFormErrors(errors) {
  // TODO
}
