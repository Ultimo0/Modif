module.exports = {
  name: 'mute',
  description: 'Met en silence le bot dans le groupe.',
  async execute({ sock, msg, db, saveDB, sendReply }) {
    const jid = msg.key.remoteJid;

    // Vérifie si c'est un groupe
    if (!jid.endsWith('@g.us')) {
      return sendReply(sock, msg, '❌ Cette commande ne peut être utilisée que dans un groupe.');
    }

    // Récupère le nom du groupe
    const groupMetadata = await sock.groupMetadata(jid);
    const groupName = groupMetadata.subject || 'Groupe';

    // Récupère l’ID de l’utilisateur
    const sender = msg.key.participant || msg.key.remoteJid;
    const tagUser = sender.split('@')[0];

    // Active le mode mute
    db[jid] = db[jid] || {};
    db[jid].muted = true;
    saveDB();

    // Message de confirmation
    const text = `🔇 *Bot mis en silence !*\n\n👤 *Par:* @${tagUser}\n👥 *Groupe:* *${groupName}*\n\nPour réactiver le bot :\n\`!unmute\``;

    await sock.sendMessage(jid, { text, mentions: [sender] });
  }
};
