async function GetDatatables (penyelidikanData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        // search, 
        id_lapdumas,
        no_sprintlid,
        perihal, 
        kasus_posisi,
        status, 
        startDate,
        endDate,
        nip,
        urutan
    } = penyelidikanData;
    log('[Penyelidikan] GetDatatables', penyelidikanData);
    try {
        let whereByNoSprintlid;
        (no_sprintlid) 
            ? 
                (whereByNoSprintlid = {
                    no_sprintlid: { 
                        [Op.iLike]: `%${no_sprintlid}%`
                    }
                })
            : (whereByNoSprintlid = {});
        
        let whereByPerihal;
        (perihal)
            ?
                (whereByPerihal = {
                    perihal: {
                        [Op.iLike]: `%${perihal}%`
                    }
                })
            : (whereByPerihal = {});
            
        let whereByKasusPosisi;
        (kasus_posisi)
            ?
                (whereByKasusPosisi = {
                    kasus_posisi: {
                        [Op.iLike]: `%${kasus_posisi}%`
                    }
                })
            : (whereByKasusPosisi = {});
    
        let whereByStatus;
        (status)
            ? (whereByStatus = { status })
            : (whereByStatus = {});

        let whereByDate;
        (startDate || endDate)
            ?
                (whereByDate = {
                    [Op.and]: [
                        { tanggal_sprintlid: { [Op.gte]: moment(startDate).format() } },
                        { tanggal_sprintlid: { [Op.lte]: moment(endDate).format() } }
                    ]
                })
            : (whereByDate = {} );

        let whereByLapdumas;
        (id_lapdumas)
            ? (whereByLapdumas = { id_lapdumas })
            : (whereByLapdumas = {});

        let whereByNip;
        (nip) 
            ? (whereByNip = { '$user_jaksa.nip$': nip })
            : (whereByNip = {});

        const where = {
            ...whereByNoSprintlid,
            ...whereByPerihal,
            ...whereByKasusPosisi,
            ...whereByStatus,
            ...whereByDate,
            ...whereByLapdumas,
            ...whereByNip
        };

        let searchOrder;
        if (urutan !== '') {
            searchOrder = [['tanggal_sprintlid', urutan]];
        };

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Penyelidikan.count({}),
            Penyelidikan.count({ 
                include: {
                    model: User_jaksa,
                    as: 'user_jaksa',
                    required: true,
                    duplicating: false
                },
                where 
            }),
            Penyelidikan.findAll({
                include: [
                    {
                        model: Lapdumas,
                        as: 'lapdumas'
                    },
                    {
                        model: File_penyelidikan,
                        attributes: [
                            'id', 
                            'id_penyelidikan', 
                            'destination', 
                            'filename', 
                            'path', 
                            'tanggal',
                            'keterangan'
                        ],
                        as: 'files'
                    },
                    {
                        model: User_jaksa,
                        attributes: [
                            'id', 
                            'id_penyelidikan',
                            'username',
                            'nama_lengkap', 
                            'nip', 
                            'email'
                        ],
                        as: 'user_jaksa',
                        required: (nip) ? true : false,
                        duplicating: (nip) ? false : true
                    }
                ],
                where,
                order: searchOrder,
                offset: start,
                limit: length,
                nest: true
            })
        ]);

        return {
            draw,
            recordsTotal,
            recordsFiltered,
            data
        };
    } catch (error) {
        return error;
    }
}