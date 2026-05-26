# 🛍️ ShopWave

> **Loja virtual completa com carrinho de compras** — filtros por categoria, busca em tempo real, persistência e checkout simulado.

![Status](https://img.shields.io/badge/status-live-brightgreen?style=flat-square)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## 📸 Preview

```
╭────────────────────────────────────────────────────╮
│  SHOP WAVE   Todos | Eletrônicos | Moda | Casa  🛒3 │
│  ──────────────────────────────────────────────    │
│  ESTILO      ╭─────╮  ╭─────╮  ╭─────╮            │
│  SEM LIMITES │ 🎧  │  │ 👟  │  │ 💡  │            │
│              │Fone │  │Tênis│  │LED  │            │
│  Ver produtos│R$350│  │R$290│  │R$130│            │
╰────────────────────────────────────────────────────╯
```

## ✨ Funcionalidades

- 🛒 **Carrinho completo** com adicionar, remover, alterar quantidade
- 🔍 **Busca em tempo real** com debounce de 300ms
- 🏷️ **Filtros por categoria**: Eletrônicos, Moda, Casa, Esportes
- 📊 **Ordenação** por preço (asc/desc) e nome
- 🎉 **Frete grátis** automático acima de R$199
- 💾 **Carrinho persistido** no localStorage
- 🔔 Toast de notificação para feedback do usuário
- 📱 Layout totalmente responsivo
- ♿ Acessibilidade com `title`, `aria-label` e foco correto

---

## 🚀 Como usar

```bash
git clone https://github.com/seu-usuario/shopwave.git
cd shopwave
open index.html
```

Sem dependências, sem build step. Abre direto no browser.

---

## 📁 Estrutura

```
shopwave/
├── index.html   # Estrutura da página
├── style.css    # Design system completo
├── data.js      # Catálogo de produtos (simula API)
├── app.js       # Lógica do carrinho e filtros
└── README.md    # Documentação
```

---

## 🧠 Arquitetura

```javascript
// Estado global centralizado
const state = {
  cart:   [],        // Itens: [{ id, qty }]
  filter: 'all',     // Categoria ativa
  sort:   'default', // Critério de ordenação
  query:  '',        // Texto de busca
};
```

**Pipeline de renderização:**
```
state → getFilteredProducts() → renderProducts() → DOM
                                       ↓
state.cart → renderCart() → sidebar do carrinho
```

**Separação de responsabilidades:**
- `data.js` — dados (simulação de API/banco)
- `app.js`  — lógica de negócio e manipulação de DOM

---

## 💡 Conceitos aplicados

| Conceito | Implementação |
|----------|---------------|
| Persistência | `localStorage` |
| Busca | `debounce` com `setTimeout` |
| Eventos | Delegação de eventos no carrinho |
| Renderização | Re-render controlado via `state` |
| Formatação | `Intl.NumberFormat` via `toLocaleString` |
| Animações | CSS `@keyframes` com `animation-delay` staggered |
| UX | Toast, botão "Adicionado" com timeout |

---

## 🗺️ Roadmap

- [ ] Página de detalhes do produto
- [ ] Sistema de avaliações
- [ ] Favoritos / Wishlist
- [ ] Integração com API de pagamento (Stripe/MercadoPago)
- [ ] Painel administrativo para gerenciar produtos
- [ ] Backend com Node.js + MongoDB

---

## 📄 Licença

MIT © [Adryan Miqueias Oliveira Pereira]
