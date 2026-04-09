const roadmapData = [
  {
    main: 'SQL (Main Head)',
    subtopics: [
      'SELECT, WHERE, GROUP BY, HAVING, ORDER BY',
      'Joins: INNER, LEFT, RIGHT, FULL',
      'Window functions: ROW_NUMBER, RANK, LAG/LEAD',
      'CTEs and subqueries',
      'Query optimization and indexes'
    ]
  },
  {
    main: 'Python for Data',
    subtopics: [
      'Core Python and data structures',
      'Pandas and NumPy',
      'Data cleaning and feature engineering',
      'APIs and file handling (CSV, JSON, Parquet)',
      'Unit tests for data code'
    ]
  },
  {
    main: 'Data Engineering Fundamentals',
    subtopics: [
      'ETL vs ELT design patterns',
      'Data warehouses: Snowflake/BigQuery/Redshift concepts',
      'Batch and streaming pipelines',
      'Data modeling: star/snowflake schemas',
      'Data quality checks and observability'
    ]
  },
  {
    main: 'Big Data & Cloud',
    subtopics: [
      'Spark basics (DataFrame API)',
      'Airflow orchestration',
      'Cloud storage and compute basics',
      'Partitioning and file formats',
      'Security and IAM fundamentals'
    ]
  },
  {
    main: 'Data Science Core',
    subtopics: [
      'Statistics and probability',
      'Exploratory data analysis',
      'Supervised and unsupervised ML',
      'Model evaluation and validation',
      'Experimentation and A/B testing'
    ]
  },
  {
    main: 'MLOps & Production',
    subtopics: [
      'Model deployment basics',
      'CI/CD for data and ML pipelines',
      'Monitoring drift and model performance',
      'Feature stores and model registry',
      'Documentation and reproducibility'
    ]
  }
];

const practiceQuestions = [
  {
    topic: 'SQL',
    items: [
      'Explain the difference between INNER JOIN and LEFT JOIN with an example.',
      'How do you find duplicate rows in a table?',
      'Write a query to get the 2nd highest salary per department.',
      'When should you use a window function over GROUP BY?'
    ]
  },
  {
    topic: 'Data Engineering',
    items: [
      'How do you design an incremental ETL pipeline?',
      'What are the tradeoffs between batch and streaming?',
      'How would you implement data quality checks in production?',
      'Explain partitioning strategy for a 1TB events table.'
    ]
  },
  {
    topic: 'Data Science',
    items: [
      'How do bias and variance affect model performance?',
      'What metrics would you use for imbalanced classification?',
      'Describe a complete ML lifecycle from data to deployment.',
      'How do you detect and handle data leakage?'
    ]
  }
];

const storageKey = 'roadmap-progress-v1';
const topicsContainer = document.getElementById('topics-container');
const questionsContainer = document.getElementById('questions-container');
const progressBar = document.getElementById('overall-progress');
const progressText = document.getElementById('progress-text');
const resetButton = document.getElementById('reset-progress');

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function calculateProgress() {
  const checks = [...document.querySelectorAll('input[type="checkbox"][data-topic-id]')];
  if (checks.length === 0) {
    progressBar.value = 0;
    progressText.textContent = '0% completed';
    return;
  }

  const done = checks.filter((c) => c.checked).length;
  const percent = Math.round((done / checks.length) * 100);
  progressBar.value = percent;
  progressText.textContent = `${percent}% completed (${done}/${checks.length})`;
}

function renderTopics() {
  const state = loadState();
  topicsContainer.innerHTML = '';

  roadmapData.forEach((group, groupIndex) => {
    const details = document.createElement('details');
    details.className = 'topic';
    if (groupIndex === 0) details.open = true;

    const summary = document.createElement('summary');
    summary.textContent = group.main;

    const subtopics = document.createElement('div');
    subtopics.className = 'subtopics';

    group.subtopics.forEach((subtopic, topicIndex) => {
      const id = `${groupIndex}-${topicIndex}`;
      const label = document.createElement('label');
      label.className = 'item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.topicId = id;
      checkbox.checked = Boolean(state[id]);

      checkbox.addEventListener('change', () => {
        const current = loadState();
        current[id] = checkbox.checked;
        saveState(current);
        calculateProgress();
      });

      const text = document.createElement('span');
      text.textContent = subtopic;

      label.appendChild(checkbox);
      label.appendChild(text);
      subtopics.appendChild(label);
    });

    details.appendChild(summary);
    details.appendChild(subtopics);
    topicsContainer.appendChild(details);
  });

  calculateProgress();
}

function renderQuestions() {
  questionsContainer.innerHTML = '';

  practiceQuestions.forEach((group) => {
    const card = document.createElement('article');
    card.className = 'question';

    const heading = document.createElement('h4');
    heading.textContent = `${group.topic} Practice`;
    card.appendChild(heading);

    const list = document.createElement('ol');
    group.items.forEach((q) => {
      const item = document.createElement('li');
      item.textContent = q;
      list.appendChild(item);
    });

    card.appendChild(list);
    questionsContainer.appendChild(card);
  });
}

resetButton.addEventListener('click', () => {
  localStorage.removeItem(storageKey);
  renderTopics();
});

renderTopics();
renderQuestions();
