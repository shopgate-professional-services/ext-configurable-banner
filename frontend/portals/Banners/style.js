import { css } from 'glamor';

export const scrolledIn = css({
  '&&': {
    transform: 'translateY(0%)',
    marginBottom: 0,
  },
});

export const scrolledOut = css({
  '&&': {
    transform: 'translateY(-250%)',
  },
});

export const scrollHeaderStyle = css({
  transition: 'transform 0.2s ease,transform 0.2s, margin-bottom 0.2s ease',
});

export const overflowWrapper = css({
  overflow: 'hidden',
});
