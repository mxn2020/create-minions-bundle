import './App.css';

function App() {
    return (
        <div className="app">
            <header className="hero">
                <h1>{{ projectCapitalized }}</h1>
                <p className="tagline">{{ projectDescription }}</p>
                <div className="cta-buttons">
                    <a href="https://{{domainHelp}}" className="btn btn-primary">
                        Documentation
                    </a>
                    <a href="https://github.com/{{githubRepo}}" className="btn btn-secondary">
                        GitHub
                    </a>
                </div>
            </header>

            <main className="content">
                <section className="features">
                    <div className="feature-card">
                        <h3>TypeScript SDK</h3>
                        <code>npm install {{ sdkName }}</code>
                    </div>
                    <div className="feature-card">
                        <h3>Python SDK</h3>
                        <code>pip install {{ pythonPackage }}</code>
                    </div>
                    <div className="feature-card">
                        <h3>CLI Tool</h3>
                        <code>npm install -g {{ cliName }}</code>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <p>
                    Built on the{' '}
                    <a href="https://github.com/mxn2020/minions">Minions SDK</a>
                </p>
            </footer>
        </div>
    );
}

export default App;
