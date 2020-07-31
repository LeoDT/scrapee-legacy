/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

import { Store } from '../store';
import { StoreContext } from '../context';
import { Cache } from 'core/client/cache';
import { Client, ClientResult } from 'core/client/types';

function delayedValue<T>(v: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(v), 500));
}

const client: Client = {
  cache: new Cache(),
  send<T extends any>(r: any): Promise<ClientResult<T>> {
    if (r) {
      return delayedValue({
        success: true,
        data: {} as T,
      });
    } else {
      return delayedValue({
        success: false,
        errors: [],
      });
    }
  },
};

const store = new Store(client);

store.loadBuckets();

export default function CosmosDecorator({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div>
      <div
        style={{ padding: 20 }}
        dangerouslySetInnerHTML={{
          __html: `<div><div><div><h1>Resources &amp; Assets</h1> <div>
          Useful resources and assets for Tailwind users.
        </div> <hr></div> <div><div><p>We think Tailwind is an amazing CSS framework, but you need more than just a CSS framework to produce visually awesome work.</p> <p>Here are some resources that can help you take your Tailwind projects to the next level.</p> <hr> <h2 id="learning-design"><a href="#learning-design" data-anchorjs-icon="#" aria-label="Anchor"></a>Learning design</h2> <h3 id="refactoring-ui"><a href="#refactoring-ui" data-anchorjs-icon="#" aria-label="Anchor"></a>Refactoring UI</h3> <p><a href="https://refactoringui.com/book">Refactoring UI</a> is a design-for-developers book + video series put together by <a href="https://twitter.com/adamwathan">Adam Wathan</a> (that's me, the creator of Tailwind) and <a href="https://twitter.com/steveschoger">Steve Schoger</a> (who created Tailwind's default design system).</p> <p><a href="https://refactoringui.com/book"><img alt="" src="https://tailwindcss.com/img/resources/refactoring-ui.png"></a></p> <p>It covers literally everything we know about making things look awesome, and purchasing it is a great way to support our work on Tailwind, allowing us to spend more time developing the framework and surrounding ecosystem.</p> <p>Almost 10,000 people have picked it up so far and have all sorts of <a href="https://refactoringui.com/book/kind-words/">awesome things to say</a> about how it helped them improve their work.</p> <p><a href="https://refactoringui.com/book">Learn more about Refactoring UI →</a></p> <hr> <h2 id="images-and-illustrations"><a href="#images-and-illustrations" data-anchorjs-icon="#" aria-label="Anchor"></a>Images and illustrations</h2> <h3 id="unsplash"><a href="#unsplash" data-anchorjs-icon="#" aria-label="Anchor"></a>Unsplash</h3> <p><a href="https://unsplash.com/">Unsplash</a> is an amazing resource for finding beautiful, high-resolution, free photos that you can use in your projects.</p> <p><a href="https://unsplash.com/"><img alt="" src="https://tailwindcss.com/img/resources/unsplash.jpg"></a></p> <p>We use Unsplash any time we need example photos in the documentation, like for our <a href="/components/cards">card components</a>.</p> <p><a href="https://unsplash.com">Find free photography on Unsplash →</a></p> <h3 id="undraw"><a href="#undraw" data-anchorjs-icon="#" aria-label="Anchor"></a>unDraw</h3> <p><a href="https://undraw.co/">unDraw</a> is like Unsplash but for amazing vector illustrations, created by the amazing <a href="https://twitter.com/ninalimpi">Katerina Limpitsouni</a>.</p> <p><a href="https://undraw.co/"><img alt="" src="https://tailwindcss.com/img/resources/undraw.png"></a></p> <p>They're easy to customize and perfect for landing pages, empty states, and more.</p> <p><a href="https://undraw.co/">Find free illustrations on unDraw →</a></p> <hr> <h2 id="icons"><a href="#icons" data-anchorjs-icon="#" aria-label="Anchor"></a>Icons</h2> <h3 id="heroicons-ui"><a href="#heroicons-ui" data-anchorjs-icon="#" aria-label="Anchor"></a>Heroicons UI</h3> <p><a href="https://github.com/sschoger/heroicons-ui">Heroicons UI</a> is a free SVG icon set created by <a href="https://twitter.com/steveschoger">Steve Schoger</a>. They're pre-optimized and easy to use directly in your HTML where you can customize them using Tailwind's color and sizing utilities.</p> <p><a href="https://github.com/sschoger/heroicons-ui"><img alt="" src="https://tailwindcss.com/img/resources/heroicons-ui.png"></a></p> <p><a href="https://github.com/sschoger/heroicons-ui">Get Heroicons UI →</a></p> <h3 id="zondicons"><a href="#zondicons" data-anchorjs-icon="#" aria-label="Anchor"></a>Zondicons</h3> <p><a href="http://www.zondicons.com/">Zondicons</a> is another free SVG icon set by <a href="https://twitter.com/steveschoger">Steve Schoger</a> drawn in a different style.</p> <p><a href="http://www.zondicons.com/"><img alt="" src="https://tailwindcss.com/img/resources/zondicons.png"></a></p> <p><a href="http://www.zondicons.com/">Get Zondicons →</a></p> <h3 id="entypo"><a href="#entypo" data-anchorjs-icon="#" aria-label="Anchor"></a>Entypo</h3> <p><a href="http://www.entypo.com/">Entypo</a> is a great free SVG icon set created by <a href="http://www.danielbruce.se/">Daniel Bruce</a>.</p> <p><a href="http://www.entypo.com/"><img alt="" src="https://tailwindcss.com/img/resources/entypo.png"></a></p> <p><a href="https://github.com/adamwathan/entypo-optimized">Get Entypo →</a></p> <hr> <h2 id="background-patterns"><a href="#background-patterns" data-anchorjs-icon="#" aria-label="Anchor"></a>Background patterns</h2> <h3 id="hero-patterns"><a href="#hero-patterns" data-anchorjs-icon="#" aria-label="Anchor"></a>Hero Patterns</h3> <p><a href="http://www.heropatterns.com/">Hero Patterns</a> is a set of repeatable, customizable SVG background patterns, also created by <a href="https://twitter.com/steveschoger">Steve Schoger</a>. They're perfect for adding a little bit of excitement to an otherwise bland background, without all the weight of a raster format like JPG or PNG.</p> <p><a href="http://www.heropatterns.com/"><img alt="" src="https://tailwindcss.com/img/resources/hero-patterns.png"></a></p> <p><a href="http://www.heropatterns.com/">Get free background patterns at Hero Patterns →</a></p></div> <div><div><div><h5>On this page</h5> <ul><li><a href="#learning-design">Learning design</a></li><li><a href="#refactoring-ui">Refactoring UI</a></li><li><a href="#images-and-illustrations">Images and illustrations</a></li><li><a href="#unsplash">Unsplash</a></li><li><a href="#undraw">unDraw</a></li><li><a href="#icons">Icons</a></li><li><a href="#heroicons-ui">Heroicons UI</a></li><li><a href="#zondicons">Zondicons</a></li><li><a href="#entypo">Entypo</a></li><li><a href="#background-patterns">Background patterns</a></li><li><a href="#hero-patterns">Hero Patterns</a></li></ul></div> <div id="ad"></div> <div id="tailwind-ui-widget"><a href="https://tailwindui.com/?utm_source=tailwindcss&amp;utm_medium=sidebar-widget"><img alt="Tailwind UI" src="https://tailwindcss.com/img/tailwind-ui-sidebar.png"></a> <p><a href="https://tailwindui.com/?utm_source=tailwindcss&amp;utm_medium=sidebar-widget">
              Beautiful UI components by the creators of Tailwind CSS.
              </a></p> <div><a href="https://tailwindui.com/?utm_source=tailwindcss&amp;utm_medium=sidebar-widget">
                Learn more →
              </a></div></div> <div id="refactoring-ui-widget"><a href="https://refactoringui.com/book?utm_source=tailwindcss&amp;utm_medium=sidebar-widget"><img alt="" src="https://tailwindcss.com/img/refactoring-ui-book.png"></a> <p><a href="https://refactoringui.com/book?utm_source=tailwindcss&amp;utm_medium=sidebar-widget">
              Learn UI design, from the creators of Tailwind CSS.
              </a></p> <div><a href="https://refactoringui.com/book?utm_source=tailwindcss&amp;utm_medium=sidebar-widget">
                Learn more →
              </a></div></div></div></div></div></div></div>`,
        }}
      />
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    </div>
  );
}
