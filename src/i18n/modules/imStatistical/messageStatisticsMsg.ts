export default {
  zh: {
    messageStatisticsMsg: {
      uplinkSingleChat: '单聊上行消息数',
      uplinkSingleChatDescription: '用户发送到服务器的单聊消息数(包含用户和API发送)。',
      upstreamMessagesChat: '单聊人均上行消息数',
      upstreamMessagesChatDescription: '每个发送单聊消息的用户平均发送的单聊上行消息数(包含用户和API发送)。',
      downlinkMessageCount: '单聊下行消息数',
      downlinkMessageCountDescription: '用户在线时接收到的单聊消息数与上线后接收到的离线单聊消息数之和。',
      perPersonCount: '单聊人均下行消息数',
      perPersonCountDescription: '每个接收到单聊消息的用户平均接收到的单聊下行消息数。',
      systemMessageDistribution: '系统消息分发消息数',
      systemMessageDownlink: '系统消息下行消息数',
      downlinkMessagesPerPerson: '系统消息人均下行消息数',
      pushMessages: '系统消息Push消息数',
      groupChatUplinkMessages: '群聊上行消息数',
      groupChatUplinkMessagesDescription: '用户发送到服务器的群聊消息数(包含用户和API发送)。',
      uplinkMessagesGroupChat: '群聊平均上行消息数',
      uplinkMessagesGroupChatDescription: '每个活跃群组平均发送的上行消息数(包含用户和API发送)。',
      groupChatDistributionMessages: '群聊分发消息数',
      groupChatDistributionMessagesDescription: '服务器分发给指定用户的群聊消息数。',
      groupChatDownlinkMessages: '群聊下行消息数',
      groupChatDownlinkMessagesDescription: '用户在线时接收到的群聊消息数与上线后接收到的离线群聊消息数之和。',
      systemMessageUplinkMessages: '系统消息上行消息数',
      systemMessageUplinkMessagesDescription: '系统发送到服务器的系统消息数(包含用户和API发送)。',
      systemMessageDistributionMessages: '系统消息分发消息数',
      systemMessageDistributionMessagesDescription: '服务器分发给指定用户的系统消息数。',
      systemMessageDownlinkMessages: '系统消息下行消息数',
      systemMessageDownlinkMessagesDescription: '用户在线时接收到的系统消息数与上线后接收到的离线系统消息数之和。',
      systemPerPersonDownlinkMessages: '系统消息人均下行消息数',
      systemPerPersonDownlinkMessagesDescription: '每个接收到系统消息的用户平均接收到的系统下行消息数。',
      systemMessagePushMessages: '系统消息 Push 消息数',
      systemMessagePushMessagesDescription: '用户离线时服务端直接推送的系统 Push 消息数。'
    }
  },
  en: {
    messageStatisticsMsg: {
      uplinkSingleChat: 'Number of uplink messages in a single chat',
      uplinkSingleChatDescription: 'The number of single chat messages sent by the user to the server (both user and API sent).',
      upstreamMessagesChat: 'Number of upstream messages per user per chat',
      upstreamMessagesChatDescription:
        'The average number of single-chat uplink messages sent by each user sending single-chat messages (including user and API sending).',
      downlinkMessageCount: 'Single chat downlink message count',
      downlinkMessageCountDescription:
        'Sum of the number of single chat messages received by an online user and the number of offline single chat messages received by an online user.',
      perPersonCount: 'Number of downlink messages per person per chat',
      perPersonCountDescription: 'The average number of single-chat downlink messages received by each user receiving single-chat messages.',
      systemMessageDistribution: 'Number of system message distribution messages',
      systemMessageDownlink: 'Number of system message downlink messages',
      downlinkMessagesPerPerson: 'Number of downlink messages per person in the system',
      pushMessages: 'Number of system message push messages',
      groupChatUplinkMessages: 'Number of group chat uplink messages',
      groupChatUplinkMessagesDescription: 'The number of group chat messages sent by users to the server (including those sent by users and APIs).',
      uplinkMessagesGroupChat: 'Average number of uplink messages in group chat',
      uplinkMessagesGroupChatDescription: 'The average number of uplink messages sent by each active group (including user and API sending).',
      groupChatDistributionMessages: 'Number of group chat distribution messages',
      groupChatDistributionMessagesDescription: 'The number of group chat messages distributed by the server to specified users.',
      groupChatDownlinkMessages: 'Number of group chat downlink messages',
      groupChatDownlinkMessagesDescription:
        'The sum of the number of group chat messages received by users online and the number of offline group chat messages received after going online.',
      systemMessageUplinkMessages: 'Number of system message uplink messages',
      systemMessageUplinkMessagesDescription: 'The number of system message uplink messages sent by the system to the server (including user and API sending).',
      systemMessageDistributionMessages: 'Number of system message distribution messages',
      systemMessageDistributionMessagesDescription: 'The number of system messages distributed by the server to specified users.',
      systemMessageDownlinkMessages: 'Number of system message downlink messages',
      systemMessageDownlinkMessagesDescription:
        'The sum of the number of system messages received by users online and the number of offline system messages received after going online.',
      systemPerPersonDownlinkMessages: 'Number of downlink messages per person in the system',
      systemPerPersonDownlinkMessagesDescription: 'The average number of system downlink messages received by each user who receives system messages.',
      systemMessagePushMessages: 'Number of system message push messages',
      systemMessagePushMessagesDescription: 'The number of system push messages directly pushed by the server when the user is offline.'
    }
  }
}
