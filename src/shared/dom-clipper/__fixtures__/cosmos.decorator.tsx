import * as React from 'react';
import { Store } from '../store';
import { StoreContext } from '../context';
import { Bucket } from '../../models/Bucket';

const store = new Store({
  async init() {
    return {};
  },
  async loadBuckets() {
    return {
      buckets: [
        new Bucket('/Users/LeoDT/tmp/scrapee/buckets/bucket1', 'bucket1'),
        new Bucket('/Users/LeoDT/tmp/scrapee/buckets/bucket2', 'bucket2')
      ]
    };
  },
  async saveScrap() {
    return {};
  }
});

store.loadBuckets();

export default function CosmosDecorator({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div>
      <div className="markdown">
        <h1>Experiments</h1>
        <div>
          <h2 id="experiments">
            <code>experiments</code>
            <a href="#experiments" aria-hidden="true">
              <span className="icon icon-link" />
            </a>
          </h2>
          <p>
            <code>boolean: false</code>
          </p>
          <p>
            <code>experiments</code> option was introduced in webpack 5 in order to empower users
            with an ability of activating and trying out experimental features.
          </p>
          <blockquote className="warning">
            <p>
              Because experimental features have relaxed semantic versioning and might contain
              breaking changes, make sure to fix webpack&#39;s version to minor e.g.{' '}
              <code>webpack: ~5.4.3</code> instead of <code>webpack: ^5.4.3</code> or use a lockfile
              when using <code>experiments</code>.
            </p>
          </blockquote>
          <p>Available options:</p>
          <ul>
            <li>
              <code>mjs</code>: Support <code>.mjs</code> files as a way to define{' '}
              <a href="https://nodejs.org/api/esm.html#esm_ecmascript_modules">
                EcmaScript modules
              </a>
            </li>
            <li>
              <code>outputModule</code>: enables the use of{' '}
              <a href="/configuration/output/#outputmodule">
                <code>output.module</code>
              </a>{' '}
              configuration option and sets it to <code>true</code>. Enables the use of{' '}
              <code>output.libraryTarget</code> as <code>&#39;module&#39;</code> and sets it to{' '}
              <code>&#39;module&#39;</code>.
            </li>
          </ul>
          <p>
            <strong>webpack.config.js</strong>
          </p>
          <pre>
            <code className="hljs language-javascript">
              module<span className="token punctuation">.</span>exports{' '}
              <span className="token operator">=</span>{' '}
              <span className="token punctuation">&#123;</span>
              <span className="token comment">//...</span>
              experiments<span className="token punctuation">:</span>{' '}
              <span className="token punctuation">&#123;</span>
              mjs<span className="token punctuation">:</span>{' '}
              <span className="token boolean">true</span>
              <span className="token punctuation">&#125;</span>
              <span className="token punctuation">&#125;</span>
              <span className="token punctuation">;</span>
            </code>
          </pre>
        </div>
      </div>

      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    </div>
  );
}
