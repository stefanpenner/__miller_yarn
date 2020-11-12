async function json(url) {
  const response = await fetch(url)
  return response.json();
}

function renderColumn(column, current = {}, data) {
  column.textContent= '';

  for (let name of Object.keys(current)) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const key = `${name}@${current[name]}`
    a.textContent = key;
    if (data[key].dependencies) {
      a.href = '#';
    }
    li.pkg = data[key];
    li.appendChild(a);
    column.appendChild(li);
  }
}

(async function main() {
  const yarn = await json('/yarn.json');
  const pkg = await json('/package.json');
  const stack = [];
  const container = document.getElementById('container');
  const back = document.getElementById('back');

  back.onclick = (e) => {
    let column;

    if (container.children[2].childElementCount === 0) {
      container.children[1].textContent = '';
    } else {
      container.children[2].textContent = '';
    }

    if (stack.length > 0) {
      container.prepend(stack.pop());
    }

    if (container.children[1].childElementCount === 0 &&
      container.children[2].childElementCount === 0) {
      back.disabled = true;
    }
  };

  container.onclick = (e) => {
    const li = e.target.parentElement;
    const { pkg } = li;
    if (!pkg) {
      return;
    }

    const column = li.parentElement;
    const container = column.parentElement;
    const columns = container.querySelectorAll('ul');
    let index = [...columns].indexOf(column);
    let skipRender = false;

    if (index === 0) {
      if (stack.length === 0) {
        columns[1].innerText = '';
        columns[2].innerText = '';
      } else {
        container.removeChild(columns[2]);
        container.prepend(stack.pop());
        skipRender = true;
      }
    } else if (index === 1) {
      columns[2].innerText = '';
    } else if (index === 2) {
      const first = container.querySelector(':nth-child(1)');
      container.removeChild(first);
      container.appendChild(document.createElement('ul'));
      stack.push(first)
      index--;
    } else {
      throw new Error('OMG');
    }

    if (!skipRender) {
      renderColumn(container.children[index+1], pkg.dependencies, yarn.object);
    }

    if (container.children[1].childElementCount === 0 &&
      container.children[2].childElementCount === 0) {
      back.disabled = true;
    } else {
      back.disabled = false;
    }
  }

  renderColumn(container.querySelector(':nth-child(1)'), pkg.dependencies, yarn.object);
})();
