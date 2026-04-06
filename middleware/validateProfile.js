module.exports = (req, res, next) => {
    const allowedFields = [
        'avatar', 'name', 'bio', 'photos', 'videos', 'location', 'gender', 'nickname', 'searchRadius', 'interests', 'lookingFor', 'ageRange', 'hideProfile', 'jungType', 'contacts', 'lunarSettings', 'deviceToken', 'placeOfBirth', 'timeOfBirth',
        'notificationSettings', 'appSettings', 'isOpenForReading', 'dateOfBirth'
    ];
    const invalid = Object.keys(req.body).filter((key) => !allowedFields.includes(key));
    if (invalid.length > 0) {
        return res.status(400).json({ message: `Недопустимые поля: ${invalid.join(', ')}` });
    }
    next();
};
