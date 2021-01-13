pages = [
        { 'title': 'Introduction',
        },
        { 'title': 'Team Profile',
        },
        { 'title': 'Ideal Jobs',
        },
        { 'title': 'Tools',
        },
        { 'title': 'Industry Data',
        },
        { 'title': 'IT Work',
        },
        { 'title': 'IT Technologies',
        },
        { 'title': 'Project Idea',
        },
        { 'title': 'Group Reflection',
        },
        { 'title': 'Bibliography',
        },
        ];

customElements.define('nav-home', class NavHome extends HTMLElement
  {
    connectedCallback()
    {
      this.innerHTML = `
        <ion-header translucent>
          <ion-toolbar>
            <ion-title slot="start">SEEKS - I2IT A2</ion-title>
            <ion-item lines="none">
              <ion-icon name="moon" slot="end"></ion-icon>
              <ion-toggle id="themeToggle" slot="end"></ion-toggle>
            </ion-item>
          </ion-toolbar>
        </ion-header>
        <ion-content fullscreen>
          <ion-list>
          ${pages.map(page => `
            <ion-item button onclick="showDetail('${page.title}')">
              <ion-label>
                <h3>${page.title}</h3>
              </ion-label>
            </ion-item>
          `).join('\n')}
          </ion-list>
        </ion-content>
      `;

    const toggle = document.querySelector('#themeToggle');
    if(window.localStorage.darkMode=="true")
    {
      toggle.checked=true;
      document.body.classList.toggle('dark', true);
    }
    toggle.addEventListener('ionChange', (ev) =>
      {
        document.body.classList.toggle('dark', ev.detail.checked);
        window.localStorage.darkMode=ev.detail.checked;
      });

    }
  });

const nav = document.querySelector('ion-nav');

function showDetail(title)
{
  const page = pages.find(page => page.title === title);
  nav.push('nav-detail', { page });
}

customElements.define('nav-detail', class NavDetail extends HTMLElement
  {
    connectedCallback()
    {
      var object = this.page ? this.page:this.tech;
      this.innerHTML = `
        <ion-header translucent>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button defaultHref="/"></ion-back-button>
            </ion-buttons>
            <ion-title>${object.title}</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content id="${object.title}" fullscreen class="ion-padding">
        </ion-content>
        `;
      get_content(object.title);
    }
  });

function status(response)
{
  if(response.status >= 200 && response.status < 300)
  {
    return Promise.resolve(response);
  }
  else
  {
    return Promise.reject(new Error(response.statusText));
  }
}

function get_content(title)
{
  const content=document.getElementById(title);
  if(title=="IT Technologies")
  {
    content.innerHTML=it_technologies_menu();
    return;
  }
  fetch('./content/'+title.replace(/\//g, ' ')+".html")
  .then(status)
  .then(function(response)
    {
      return response.text();
    }) 
  .then(function(html)
    {
      content.innerHTML=html;
    })
  .catch(function(error)
    {
      content.innerHTML="Ack, we got an error for content `"+title+"`: "+error;
    });
}

const technologies = [
  { 'title': 'Machine Learning',
  },
  { 'title': 'Virtual/Augmented/Extended Reality',
  },
  { 'title': 'Natural Language Processing',
  },
  { 'title': 'Blockchain',
  },
];

function it_technologies_menu()
{
  return `
          <ion-list>
          ${technologies.map(tech => `
            <ion-item button onclick="showTech('${tech.title}')">
              <ion-label>
                <h3>${tech.title}</h3>
              </ion-label>
            </ion-item>
          `).join('\n')}
          </ion-list>
      `;
}

function showTech(title)
{
  const tech = technologies.find(tech => tech.title == title);
  nav.push('nav-detail', { tech });
}

customElements.define('nav-detail-tech', class NavDetail extends HTMLElement
  {
    connectedCallback()
    {
      this.innerHTML = `
      <ion-header translucent>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/"></ion-back-button>
          </ion-buttons>
          <ion-title>${this.tech.title}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content id="${object.title}" fullscreen class="ion-padding">
      </ion-content>
      `;
      get_content(this.tech.title);
    }
  });

if('serviceWorker' in navigator)
{
  window.addEventListener('load', function()
    {
      navigator.serviceWorker.register('./service-worker.js');
    });
}
