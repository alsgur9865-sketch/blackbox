import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../analytics';

const routeEvents = {
  '/': 'landing_viewed',
  '/login': 'auth_page_viewed',
  '/diagnosis': 'diagnosis_started',
  '/reports': 'reports_list_viewed',
  '/action-plans': 'action_plans_viewed'
};

export default function AnalyticsRouteTracker() {
  const location = useLocation();
  const lastTrackedRef = useRef('');

  useEffect(() => {
    const eventName = routeEvents[location.pathname];
    if (!eventName) return;

    const routeKey = `${location.pathname}${location.search}`;

    if (lastTrackedRef.current === routeKey) return;
    lastTrackedRef.current = routeKey;

    trackEvent(eventName);
  }, [location.pathname, location.search]);

  return null;
}
