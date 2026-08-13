import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Projects from '../../components/Projects';
import { LanguageProvider } from '../../context/LanguageContext';
import { useGitHubStats } from '../../hooks/useGitHubStats';
import { projects } from '../../data/projects';

vi.mock('../../hooks/useGitHubStats');

const renderProjects = () =>
  render(
    <LanguageProvider>
      <Projects />
    </LanguageProvider>
  );

describe('Projects', () => {
  beforeEach(() => {
    useGitHubStats.mockReturnValue({ stats: null, loading: false, error: null });
  });

  it('renders every project by default (filter = all)', () => {
    renderProjects();
    for (const p of projects) {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    }
  });

  it('shows skeleton placeholders while GitHub stats are loading, not the real cards', () => {
    useGitHubStats.mockReturnValue({ stats: null, loading: true, error: null });
    const { container } = renderProjects();

    expect(screen.queryByText(projects[0].title)).not.toBeInTheDocument();
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
  });

  it('shows a star count badge once GitHub stats have loaded for a repo', () => {
    const repoName = projects[0].url.split('/').pop();
    useGitHubStats.mockReturnValue({
      stats: { [repoName]: { stars: 42, forks: 3 } },
      loading: false,
      error: null,
    });
    renderProjects();

    expect(screen.getByText(/42/)).toBeInTheDocument();
  });

  it('filters projects by category when a filter button is clicked', async () => {
    const user = userEvent.setup();
    renderProjects();

    const desktopOnly = projects.filter((p) => p.category?.includes('desktop'));
    const webOnly = projects.filter((p) => !p.category?.includes('desktop'));

    await user.click(screen.getByRole('button', { name: 'Masaüstü' }));

    for (const p of desktopOnly) {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    }
    for (const p of webOnly) {
      expect(screen.queryByText(p.title)).not.toBeInTheDocument();
    }
  });

  it('renders a disabled "private" button instead of a GitHub link for private projects', () => {
    renderProjects();
    const privateProject = projects.find((p) => p.isPrivate);
    expect(privateProject).toBeTruthy();

    const buttons = screen.getAllByRole('button', { name: 'Özel Proje (Private)' });
    expect(buttons.length).toBeGreaterThan(0);
    expect(buttons[0]).toBeDisabled();
  });

  it('every external project link opens in a new tab safely (rel=noopener noreferrer)', () => {
    renderProjects();
    const links = screen.getAllByRole('link', { name: /GitHub'da Gör/i });
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }
  });
});
