import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Skeleton, { SkeletonCard, SkeletonArticle } from '../../components/Skeleton';

describe('Skeleton', () => {
  it('applies the "skeleton" base class plus the given type and className', () => {
    const { container } = render(<Skeleton type="skeleton-title" className="extra" />);
    const el = container.firstChild;
    expect(el).toHaveClass('skeleton', 'skeleton-title', 'extra');
  });
});

describe('SkeletonCard', () => {
  it('renders a title, two text lines, two badges, and a button placeholder', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelectorAll('.skeleton-title')).toHaveLength(1);
    expect(container.querySelectorAll('.skeleton-text')).toHaveLength(2);
    expect(container.querySelectorAll('.skeleton-badge')).toHaveLength(2);
    expect(container.querySelectorAll('.skeleton-button')).toHaveLength(1);
  });
});

describe('SkeletonArticle', () => {
  it('renders a title, two text lines, and a button placeholder', () => {
    const { container } = render(<SkeletonArticle />);
    expect(container.querySelectorAll('.skeleton-title')).toHaveLength(1);
    expect(container.querySelectorAll('.skeleton-text')).toHaveLength(2);
    expect(container.querySelectorAll('.skeleton-button')).toHaveLength(1);
  });
});
