const searchToggle = document.querySelector('.search-toggle');
const searchForm = document.querySelector('.site-search');
const searchInput = searchForm.querySelector('input');
const query = new URLSearchParams(location.search).get('s')?.trim();

function setSearch(open) {
  searchForm.hidden = !open;
  searchToggle.setAttribute('aria-expanded', String(open));
  if (open) searchInput.focus();
}

searchToggle.addEventListener('click', () => setSearch(searchForm.hidden));
searchForm.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    setSearch(false);
    searchToggle.focus();
  }
});

if (query) {
  const pages = [
    ['Average Joe Patriot — Rapid Fire News', '../index.html'],
    ['Watch Average Joe Patriot', '../watch-average-joe-patriot/index.html'],
    ['Average Joe Patriot Merchandise', '../average-joe-patriot-merchandise/index.html'],
    ['Support the AJP Army', '../support/index.html'],
    ['Home', '../home/index.html'],
    ['Blog Post Title', 'index.html']
  ];
  const matches = pages.filter(([title]) => title.toLowerCase().includes(query.toLowerCase()));
  const results = document.querySelector('.search-results');
  const heading = document.createElement('h1');
  heading.textContent = 'Search results for “' + query + '”';
  results.append(heading);

  for (const [title, href] of matches) {
    const item = document.createElement('p');
    const link = document.createElement('a');
    link.href = href;
    link.textContent = title;
    item.append(link);
    results.append(item);
  }
  if (!matches.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No results found.';
    results.append(empty);
  }
  document.querySelector('.legacy-blog article').hidden = true;
  results.hidden = false;
  searchInput.value = query;
}
