import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Link } from "@/components/ui/Link"

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Applicreations Redesign
          </h1>
          <p className="text-xl text-gray-600">
            Phase 1: Design System Components
          </p>
        </header>

        {/* Button Showcase */}
        <section className="bg-white rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Buttons</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Sizes</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">States</h3>
              <div className="flex flex-wrap gap-4">
                <Button isLoading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Card Showcase */}
        <section className="bg-white rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default">
              <h3 className="text-lg font-semibold mb-2">Default Card</h3>
              <p className="text-gray-600">Standard card with border styling.</p>
            </Card>
            
            <Card variant="elevated">
              <h3 className="text-lg font-semibold mb-2">Elevated Card</h3>
              <p className="text-gray-600">Card with shadow for emphasis.</p>
            </Card>
            
            <Card variant="interactive">
              <h3 className="text-lg font-semibold mb-2">Interactive Card</h3>
              <p className="text-gray-600">Hover me! Includes animation with Framer Motion.</p>
            </Card>
          </div>
        </section>

        {/* Input Showcase */}
        <section className="bg-white rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Inputs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <Input 
              label="Default Input"
              placeholder="Enter text here..."
            />
            
            <Input 
              label="With Value"
              placeholder="Enter text here..."
              defaultValue="Sample text"
            />
            
            <Input 
              label="Error State"
              placeholder="Enter email..."
              error="Please enter a valid email address"
            />
            
            <Input 
              label="Success State"
              placeholder="Enter text..."
              success
              defaultValue="Validated input"
            />
          </div>
        </section>

        {/* Link Showcase */}
        <section className="bg-white rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Links</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Internal Link</h3>
              <Link href="/about">About Page (internal)</Link>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">External Link</h3>
              <Link href="https://applicreations.com">Applicreations Website (opens in new tab)</Link>
            </div>
          </div>
        </section>

        {/* Design System Info */}
        <section className="bg-white rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Design System</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-deep"></div>
                  <span className="text-sm">Blue Deep (Primary)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-action"></div>
                  <span className="text-sm">Action (Green)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-error"></div>
                  <span className="text-sm">Error (Red)</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Typography Scale</h3>
              <div className="space-y-2">
                <p className="text-xs">Extra Small (12px)</p>
                <p className="text-sm">Small (14px)</p>
                <p className="text-base">Base (16px)</p>
                <p className="text-lg">Large (18px)</p>
                <p className="text-xl">Extra Large (21px)</p>
                <p className="text-2xl">2X Large (28px)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-gray-600">
          <p>✅ Phase 1 Complete - Foundation & Design System</p>
          <p className="text-sm mt-2">Next: Phase 2 - Homepage Construction</p>
      </footer>
      </div>
    </div>
  )
}
