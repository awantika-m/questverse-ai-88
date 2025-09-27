import { IUser } from '../models/user';

/**
 * Check if a user has specific admin privileges
 */
export const checkAdminPrivilege = (user: IUser, privilege: keyof IUser['adminPrivileges']) => {
  if (!user.adminPrivileges || user.role !== 'admin') {
    return false;
  }
  return user.adminPrivileges[privilege];
};

/**
 * Calculate experience required for next level
 */
export const calculateNextLevelExperience = (currentLevel: number): number => {
  return Math.floor(100 * Math.pow(1.1, currentLevel - 1));
};

/**
 * Format system metrics for admin dashboard
 */
export const formatSystemMetrics = (metrics: any) => {
  const {
    users,
    quests,
    engagement,
    moderation,
  } = metrics;

  return {
    userStats: {
      totalUsers: users.total,
      newUsers: users.new,
      usersByRole: users.byRole.reduce((acc: any, curr: any) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
    },
    questStats: {
      activeQuests: quests.active,
      completedQuests: quests.completed,
      completionRate: quests.completed > 0 
        ? ((quests.completed / (quests.active + quests.completed)) * 100).toFixed(2)
        : 0,
    },
    engagementMetrics: {
      averageLevel: Math.round(engagement.avgLevel * 10) / 10,
      averageExperience: Math.round(engagement.avgExperience),
      totalAchievements: engagement.totalAchievements,
      postsPerUser: users.total > 0 
        ? (engagement.posts / users.total).toFixed(2)
        : 0,
    },
    moderationMetrics: {
      openReports: moderation.openReports,
      activeModeratorCount: users.byRole.find((r: any) => r._id === 'moderator')?.count || 0,
    },
  };
};

/**
 * Calculate user activity score based on various metrics
 */
export const calculateUserActivityScore = (user: IUser): number => {
  let score = 0;

  // Base metrics
  score += user.level * 10;
  score += user.experience * 0.1;
  
  // Achievement bonus
  score += (user.achievements?.length || 0) * 15;

  // Quest completion bonus
  score += (user.stats?.questsCompleted || 0) * 5;

  // Social engagement
  const socialProfile = user.socialProfile || { posts: [], followers: [], following: [] };
  score += (socialProfile.posts?.length || 0) * 2;
  score += (socialProfile.followers?.length || 0);
  score += (socialProfile.following?.length || 0) * 0.5;

  // Battle performance
  score += (user.stats?.battlesWon || 0) * 3;

  return Math.round(score);
};

/**
 * Get recommended actions for campus improvement
 */
export const getSystemRecommendations = (metrics: any) => {
  const recommendations = [];

  // User engagement recommendations
  if (metrics.engagement.avgLevel < 5) {
    recommendations.push({
      category: 'User Engagement',
      issue: 'Low average user level',
      suggestion: 'Consider adjusting quest difficulty or increasing experience rewards',
    });
  }

  // Quest balance recommendations
  const questCompletionRate = metrics.quests.completed / (metrics.quests.active + metrics.quests.completed);
  if (questCompletionRate < 0.3) {
    recommendations.push({
      category: 'Quest System',
      issue: 'Low quest completion rate',
      suggestion: 'Review quest difficulty and requirements, possibly add more beginner-friendly quests',
    });
  }

  // Social engagement recommendations
  const postsPerUser = metrics.engagement.posts / metrics.users.total;
  if (postsPerUser < 1) {
    recommendations.push({
      category: 'Social Features',
      issue: 'Low social engagement',
      suggestion: 'Consider implementing social engagement rewards or community challenges',
    });
  }

  // Moderation load recommendations
  const reportsPerModerator = metrics.moderation.openReports / metrics.moderation.activeModeratorCount;
  if (reportsPerModerator > 10) {
    recommendations.push({
      category: 'Moderation',
      issue: 'High moderation workload',
      suggestion: 'Consider recruiting more moderators or implementing automated moderation tools',
    });
  }

  return recommendations;
};