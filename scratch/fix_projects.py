import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update CSS
css_old = r'      /\* Case Files \*/.*?\.project-card \.modal-tags \{ pointer-events: auto; margin-top: auto; \}'
css_new = r'''      /* Case Files */
      .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; margin-top: 3rem; }
      .project-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 2.5rem 2rem; color: var(--text-muted); position: relative; transition: border-color 0.3s ease, transform 0.4s var(--ease-primary); display: flex; flex-direction: column; overflow: hidden; outline: none; }
      .project-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(6, 182, 212, 0.06), transparent 40%); opacity: 0; transition: opacity 0.3s; z-index: 1; pointer-events: none; }
      .project-card:hover::before, .project-card:focus-within::before { opacity: 1; }
      .project-card:hover, .project-card:focus-within { border-color: var(--accent); transform: translateY(-5px); }
      .project-content { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; }
      .project-id { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--accent); margin-bottom: 1rem; display: block; }
      .project-card h3 { font-size: 1.5rem; margin-bottom: 1rem; color: var(--text); }
      .project-card p { margin-bottom: 1.5rem; font-size: 0.95rem; }
      
      /* Hover Reveal Details */
      .project-details-wrapper { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.5s var(--ease-primary); }
      .project-details { overflow: hidden; opacity: 0; transition: opacity 0.3s ease; display: flex; flex-direction: column; gap: 1rem; }
      .project-card:hover .project-details-wrapper, .project-card:focus-within .project-details-wrapper { grid-template-rows: 1fr; margin-bottom: 1.5rem; }
      .project-card:hover .project-details, .project-card:focus-within .project-details { opacity: 1; transition: opacity 0.4s ease 0.2s; }
      .detail-section h4 { font-size: 0.85rem; color: var(--text); font-family: 'JetBrains Mono', monospace; margin-bottom: 0.25rem; text-transform: uppercase; }
      .detail-section p { font-size: 0.95rem; color: var(--text-muted); margin-bottom: 0; }
      
      .modal-tags { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: auto; }
      .tag { padding: 0.4rem 0.8rem; background: rgba(6, 182, 212, 0.1); color: var(--accent); border-radius: 99px; font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; }
      
      .modal-links { display: flex; gap: 1rem; margin-top: 1rem; }
      .modal-links a { padding: 0.5rem 1rem; font-size: 0.9rem; }'''

html = re.sub(css_old, css_new, html, flags=re.DOTALL)

# 2. Delete modals
modals_pattern = r'      <dialog id="modal-1">.*?</dialog>\s*<dialog id="modal-2">.*?</dialog>\s*<dialog id="modal-3">.*?</dialog>\s*'
html = re.sub(modals_pattern, '', html, flags=re.DOTALL)

# 3. Replace projects grid
projects_old = r'<div class="projects-grid">.*?</div>\s*</section>'
projects_new = r'''<div class="projects-grid">
          <article class="project-card interactive" tabindex="0">
            <div class="project-content">
              <span class="project-id">CASE-01</span>
              <h3>Burnaby Board of Trade Grant Search</h3>
              <p>A web-based grant search platform developed within an Agile team.</p>
              
              <div class="project-details-wrapper">
                  <div class="project-details">
                      <div class="detail-section">
                          <h4>The Problem</h4>
                          <p>Local businesses in Burnaby struggled to find applicable grants efficiently due to scattered resources.</p>
                      </div>
                      <div class="detail-section">
                          <h4>What I Built</h4>
                          <p>Working in an Agile team, we developed a centralized, searchable database platform that allows businesses to filter and discover grants tailored to their needs.</p>
                      </div>
                      <div class="detail-section">
                          <h4>Result</h4>
                          <p>Platform helps small businesses quickly identify available grants with clear eligibility criteria and funding amounts.</p>
                      </div>
                  </div>
              </div>

              <div class="modal-tags">
                <span class="tag">React</span><span class="tag">Node.js</span><span class="tag">Express</span><span class="tag">Agile</span><span class="tag">MongoDB</span>
              </div>
            </div>
          </article>

          <article class="project-card interactive" tabindex="0">
            <div class="project-content">
              <span class="project-id">CASE-02</span>
              <h3>Eurotech Assessment Services</h3>
              <p>A responsive, modern website designed and developed for a real business client.</p>

              <div class="project-details-wrapper">
                  <div class="project-details">
                      <div class="detail-section">
                          <h4>The Problem</h4>
                          <p>The client needed a professional online presence to establish credibility and attract new clients.</p>
                      </div>
                      <div class="detail-section">
                          <h4>What I Built</h4>
                          <p>Designed and developed a fully responsive website with a focus on fast load times, accessible design, and clear calls-to-action.</p>
                      </div>
                      <div class="detail-section">
                          <h4>Result</h4>
                          <p>Delivered the project within the defined scope and timeline, providing a modern, responsive website for the business.</p>
                      </div>
                      <div class="modal-links">
                          <a href="https://eurotech-canada.com/" target="_blank" rel="noopener" class="link-primary interactive">View Live</a>
                      </div>
                  </div>
              </div>

              <div class="modal-tags">
                <span class="tag">HTML5</span><span class="tag">CSS3</span><span class="tag">JavaScript</span><span class="tag">Figma</span>
              </div>
            </div>
          </article>

          <article class="project-card interactive" tabindex="0">
            <div class="project-content">
              <span class="project-id">CASE-03</span>
              <h3>Budget Tracker</h3>
              <p>A full-stack budgeting application to track income, expenses, and financial summaries.</p>

              <div class="project-details-wrapper">
                  <div class="project-details">
                      <div class="detail-section">
                          <h4>The Problem</h4>
                          <p>Personal finance management often requires complex tools that are difficult for casual users to adopt.</p>
                      </div>
                      <div class="detail-section">
                          <h4>What I Built</h4>
                          <p>A full-stack web application that simplifies tracking income and expenses, featuring intuitive data visualizations and financial summaries.</p>
                      </div>
                      <div class="detail-section">
                          <h4>Result</h4>
                          <p>[PLACEHOLDER: Add outcome, e.g., 'Created an intuitive dashboard that helps users track monthly expenses']</p>
                      </div>
                      <div class="modal-links">
                          <a href="https://github.com/yagayyavig/Budget-Tracker" target="_blank" rel="noopener" class="link-secondary interactive">Source Code</a>
                      </div>
                  </div>
              </div>

              <div class="modal-tags">
                <span class="tag">Python</span><span class="tag">Flask</span><span class="tag">SQLAlchemy</span><span class="tag">Chart.js</span>
              </div>
            </div>
          </article>
        </div>
      </section>'''

html = re.sub(projects_old, projects_new, html, flags=re.DOTALL)

# 4. Remove JS that handles modal logic
js_modal_pattern = r'\s*const projectCards = document\.querySelectorAll\(\'.project-card\'\);.*?\}\);'
html = re.sub(js_modal_pattern, '', html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
