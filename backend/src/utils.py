# app/dependencies.py

def model_to_dict(model_instance):
    """
    Convert a SQLAlchemy model instance to a dictionary
    """
    print(getattr(model_instance, 'task'))
    return {column.name: getattr(model_instance, column.name) for column in model_instance.__table__.columns}

