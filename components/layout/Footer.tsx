import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Subtle mesh grid */}
      <div
        className="absolute inset-0 opacity-[0.30]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(120, 119, 198, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(120, 119, 198, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to top, black 20%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 80%)'
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6">
          {/* Co-authors Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Co-authors</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.linkedin.com/in/mahaprasad003/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mahaprasad Mohanty
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/in/shreya-saxena-ab033123b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shreya Saxena
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/in/vainavi-nair/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Vainavi Nair
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Newsletter</h3>
            <Link
              href="https://datapecharcha.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Subscribe to our newsletter
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Get high quality DS/ML/DL/NLP content delivered straight to your inbox.
            </p>
          </div>

          {/* Empty column for spacing */}
          <div></div>
        </div>

        {/* Made with love */}
        <div className="text-center pt-6 border-t">
          <p className="text-sm text-muted-foreground">
            Made with ♥ for the community
          </p>
        </div>
      </div>
    </footer>
  );
}

